// Enums

enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

enum Version {
  V1 = "V1",
  V2 = "V2",
}

enum BillingInterval {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELED = "CANCELED",
  UNPAID = "UNPAID",
}

enum AuthProvider {
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
}

// Types

type ApiKey = {
  id: string;
  name?: string | null;
  description?: string | null;
  key: string;
  userId: string;
  version: Version;
  status: Status;
  rateLimit: number;
  permissions?: unknown | null; // JSON type
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  User: User;
  UsageRecord: UsageRecord[];
};

type BillingInfo = {
  id: string;
  userId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
  User: User;
};

type Subscription = {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
  SubscriptionPlan: SubscriptionPlan;
  User: User;
};

type SubscriptionPlan = {
  id: string;
  name: string;
  description?: string | null;
  price: number; // assuming `Decimal` in Prisma refers to a number in TypeScript
  interval: BillingInterval;
  features: unknown; // JSON type
  maxApiKeys: number;
  maxRequestsPerDay: number;
  createdAt: Date;
  updatedAt: Date;
  Subscription: Subscription[];
};

type UsageRecord = {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: HttpMethod;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  ApiKey: ApiKey;
};

type User = {
  id: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  provider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
  ApiKey: ApiKey[];
  AuditLog: AuditLog[];
  BillingInfo?: BillingInfo | null;
  Subscription: Subscription[];
};

type AuditLog = {
  id: string;
  userId: string;
  action: string;
  details?: unknown | null; // JSON type
  createdAt: Date;
  User: User;
};
