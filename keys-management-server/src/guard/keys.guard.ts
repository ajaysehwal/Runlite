import { NextFunction, Response, Request } from "express";
import { admin } from "../services";
import {
  PrismaClient,
  User,
  Subscription,
  SubscriptionPlan,
  AuthProvider,
  SubscriptionStatus,
  Plans,
  BillingInterval,
} from "@prisma/client";

export interface RequestedUser extends Request {
  user?: {
    userId: string;
    subscription?:
      | (Subscription & { SubscriptionPlan: SubscriptionPlan })
      | null;
  };
}

export class KeysGuard {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  validateRequest = async (
    req: RequestedUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const token = this.extractToken(req);
      if (!token) {
        return this.sendUnauthorized(res, "Invalid or missing authorization");
      }

      const decodedToken = await this.verifyToken(token);
      if (!decodedToken) {
        return this.sendUnauthorized(res, "Invalid token");
      }

      const user = await this.getOrCreateUser(decodedToken);
      if (!user) {
        return this.sendUnauthorized(
          res,
          "User not found or could not be created",
        );
      }

      req.user = {
        userId: user.id,
        subscription: await this.getUserSubscription(user.id),
      };

      next();
    } catch (error) {
      console.error("Middleware error:", error);
      res
        .status(500)
        .json({ error: "Internal server error during authentication" });
    }
  };

  private extractToken(req: RequestedUser): string | null {
    const header = req.headers["authorization"];
    if (!header) return null;

    const [scheme, token] = header.split(" ");
    return scheme === "Bearer" && token ? token : null;
  }

  private async verifyToken(
    token: string,
  ): Promise<admin.auth.DecodedIdToken | null> {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  }

  private async getOrCreateUser(
    decodedToken: admin.auth.DecodedIdToken,
  ): Promise<User | null> {
    let user = await this.prisma.user.findUnique({
      where: { id: decodedToken.uid },
    });
    if (!user) {
      const firebaseUser = await admin.auth().getUser(decodedToken.uid);
      const provider = this.determineProvider(firebaseUser);

      const defaultPlanId = await this.getOrCreateDefaultPlanId();

      const [newUser, subscription] = await this.prisma.$transaction([
        this.prisma.user.create({
          data: {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || null,
            photoURL: firebaseUser.photoURL || null,
            provider,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
        this.prisma.subscription.create({
          data: {
            userId: firebaseUser.uid,
            planId: defaultPlanId,
            status: SubscriptionStatus.ACTIVE,
            currentPeriodStart: new Date(),
            currentPeriodEnd: this.calculatePeriodEnd(new Date()),
            cancelAtPeriodEnd: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      ]);
      console.log(newUser, subscription);
      user = newUser;
    }

    return user;
  }

  private determineProvider(firebaseUser: admin.auth.UserRecord): AuthProvider {
    return firebaseUser.providerData[0]?.providerId === "github.com"
      ? AuthProvider.GITHUB
      : AuthProvider.GOOGLE;
  }

  private async getOrCreateDefaultPlanId(): Promise<string> {
    let defaultPlan = await this.prisma.subscriptionPlan.findFirst({
      where: { name: Plans.FREE },
    });

    if (!defaultPlan) {
      defaultPlan = await this.prisma.subscriptionPlan.create({
        data: {
          name: Plans.FREE,
          description: "Free tier subscription plan",
          price: 0,
          interval: BillingInterval.MONTHLY,
          features: JSON.stringify(["Basic access", "Limited API calls"]),
          maxApiKeys: 1,
          maxRequestsPerDay: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return defaultPlan.id;
  }

  private calculatePeriodEnd(startDate: Date): Date {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate;
  }

  private async getUserSubscription(
    userId: string,
  ): Promise<(Subscription & { SubscriptionPlan: SubscriptionPlan }) | null> {
    return this.prisma.subscription.findFirst({
      where: { userId },
      include: { SubscriptionPlan: true },
    });
  }

  private sendUnauthorized(res: Response, message: string): void {
    res.status(401).json({ error: message });
  }
}
