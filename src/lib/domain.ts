export type Service = {
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  bodyAr: string;
  bodyEn: string;
  audienceAr: string;
  audienceEn: string;
  coversAr: string[];
  coversEn: string[];
  stepsAr: string[];
  stepsEn: string[];
  requirementsAr: string[];
  requirementsEn: string[];
  feesAr: string;
  feesEn: string;
  sortOrder: number;
};

export type Faq = {
  id: number;
  serviceSlug: string | null;
  topic: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
};

export type RateRow = {
  id: number;
  code: string;
  nameAr: string;
  nameEn: string;
  buy: string;
  sell: string;
  direction: "up" | "down" | "flat";
  demo: boolean;
  updatedAt: string;
  changePct: string;
  region: string;
  base: boolean;
};

export type Branch = {
  id: number;
  kind: "branch" | "agent";
  nameAr: string;
  nameEn: string;
  governorateAr: string;
  governorateEn: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  phone: string;
  hoursAr: string;
  hoursEn: string;
  servicesAr: string;
  servicesEn: string;
  lat: string | null;
  lng: string | null;
  photoUrl: string;
  demo: boolean;
  active: boolean;
  slug?: string;
};

export type NewsItem = {
  id: number;
  slug: string;
  kind: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  bodyAr: string;
  bodyEn: string;
  demo: boolean;
  publishedAt: string;
};

export type SiteSettings = {
  phone: string;
  email: string;
  addressAr: string;
  addressEn: string;
  hoursAr: string;
  hoursEn: string;
  whatsapp: string;
  facebook: string;
  xUrl: string;
  instagram: string;
  aboutAr: string;
  aboutEn: string;
  visionAr: string;
  visionEn: string;
  missionAr: string;
  missionEn: string;
  valuesAr: string;
  valuesEn: string;
  goalsAr: string;
  goalsEn: string;
  commitmentAr: string;
  commitmentEn: string;
  transparencyAr: string;
  transparencyEn: string;
  respectAr: string;
  respectEn: string;
  strategyAr: string;
  strategyEn: string;
  legalAr: string;
  legalEn: string;
  ratesDisclaimerAr: string;
  ratesDisclaimerEn: string;
  ratesLive: boolean;
  aboutReviewAck: boolean;
  replySlaAr: string;
  replySlaEn: string;
  secureChannelAr: string;
  secureChannelEn: string;
  licenseImage: string;
  foundedOn: string;
};

export type PublicHome = {
  settings: SiteSettings;
  services: Service[];
  faqs: Faq[];
  rates: RateRow[];
  branches: Branch[];
  news: NewsItem[];
  partners: Partner[];
};

export type Publication = {
  ratesLive: boolean;
  openJobs: number;
  approvedPages: string[];
};

export type PublicView = PublicHome & {
  guides: NewsItem[];
  publication: Publication;
};

export type Partner = {
  id: number;
  nameAr: string;
  nameEn: string;
  kind: string;
  noteAr: string;
  noteEn: string;
  url: string;
  demo: boolean;
  slug?: string;
  logoUrl?: string;
  country?: string;
};

export type ManagedPage = {
  slug: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  published: boolean;
  legalApproved: boolean;
};

export type ComplaintPublic = {
  reference: string;
  pin: string;
};

export type ComplaintTrack =
  | { ok: false }
  | { ok: true; status: string; reply: string; createdAt: string };

export type ComplaintRow = {
  id: number;
  reference: string;
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  status: string;
  reply: string;
  createdAt: string;
};

export type JobPost = {
  id: number;
  titleAr: string;
  titleEn: string;
  cityAr: string;
  cityEn: string;
  bodyAr: string;
  bodyEn: string;
  published: boolean;
};

export type Profile = {
  userId: string;
  displayName: string;
  phone: string;
  role: string;
  phoneVerified: boolean;
};

export type Inquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  status: string;
  createdAt: string;
};

export type Ticket = {
  id: number;
  userId: string;
  subject: string;
  body: string;
  status: string;
  reply: string;
  createdAt: string;
};

export type Notice = {
  id: number;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  readAt: string | null;
  createdAt: string;
};

export type OwnedTransfer = {
  id: number;
  reference: string;
  status: string;
  currency: string;
  amount: string;
  senderName: string;
  beneficiaryName: string;
  pickupCityAr: string;
  pickupCityEn: string;
  demo: boolean;
  updatedAt: string;
};

export type TrackResult =
  | { ok: false }
  | {
      ok: true;
      demo: boolean;
      status: string;
      currency: string;
      pickupCityAr: string;
      pickupCityEn: string;
      updatedAt: string;
    };

export type StaffRow = {
  userId: string;
  displayName: string;
  phone: string;
  role: string;
  createdAt: string;
};

export type AuditRow = {
  id: number;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  detail: string;
  createdAt: string;
};

export type AdminTransfer = OwnedTransfer & { linked: boolean };
