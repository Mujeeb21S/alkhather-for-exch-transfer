import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Branch, SiteSettings } from "@/lib/domain";
import {
  addRate,
  adminOverview,
  claimAdmin,
  createInquiry,
  createComplaint,
  createServiceRequest,
  listServiceRequests,
  createTransferAdmin,
  ensureProfile,
  linkTransfer,
  listAllBranches,
  listAllNews,
  listAllTickets,
  listAudit,
  listComplaints,
  listCustomers,
  listInquiries,
  listJobsAdmin,
  listJobsPublic,
  listManagedPages,
  listNotices,
  listOwnedTransfers,
  listOwnTickets,
  listPartnersAdmin,
  listRatesAdmin,
  listServicesAdmin,
  listStaff,
  listTransfersAdmin,
  loadPublicHome,
  loadPublication,
  loadPublicBranch,
  loadPublicRateHistory,
  loadManagedPage,
  loadNewsItem,
  loadService,
  loadSettingsForAdmin,
  markNoticeRead,
  openTicket,
  replyComplaint,
  replyTicket,
  saveBranch,
  saveManagedPage,
  saveNews,
  savePartner,
  saveJob,
  saveRate,
  saveServiceText,
  saveSettings,
  setInquiryStatus,
  setRole,
  setTransferStatus,
  trackComplaint,
  trackTransfer,
  applyForJob,
  updateOwnProfile,
} from "@/lib/server/queries.server";
import { actNetworks, loadNetworksDesk } from "@/lib/server/networks.server";

export const getPublicHome = createServerFn({ method: "GET" }).handler(async () => loadPublicHome());

export const getPublication = createServerFn({ method: "GET" }).handler(async () => loadPublication());

export const getPublicBranch = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => loadPublicBranch(data));

export const getRateHistory = createServerFn({ method: "GET" }).handler(async () => loadPublicRateHistory());

export const submitServiceRequest = createServerFn({ method: "POST" })
  .validator((input: {
    kind: string;
    orgName: string;
    delegateName: string;
    phone: string;
    city: string;
    need: string;
    companyWebsite: string;
    idempotencyKey: string;
  }) => input)
  .handler(async ({ data }) => createServiceRequest(data));

export const adminServiceRequests = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listServiceRequests(context.userId));

export const getServicePage = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => loadService(data));

export const getNewsPage = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => loadNewsItem(data));

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((input: {
    name: string;
    phone: string;
    email: string;
    topic: string;
    message: string;
    companyWebsite: string;
    idempotencyKey: string;
  }) => input)
  .handler(async ({ data }) => createInquiry(data));

export const lookupTransfer = createServerFn({ method: "POST" })
  .validator((input: { reference: string; pin: string }) => input)
  .handler(async ({ data }) => trackTransfer(data.reference, data.pin));

export const syncProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { name: string }) => ({ name: input?.name ?? "" }))
  .handler(async ({ context, data }) => ensureProfile(context.userId, data.name));

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName: string; phone: string }) => input)
  .handler(async ({ context, data }) => updateOwnProfile(context.userId, data.displayName, data.phone));

export const myTransfers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listOwnedTransfers(context.userId));

export const attachTransfer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { reference: string; pin: string }) => input)
  .handler(async ({ context, data }) => linkTransfer(context.userId, data.reference, data.pin));

export const myNotices = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listNotices(context.userId));

export const readNotice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data }) => markNoticeRead(context.userId, data));

export const myTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listOwnTickets(context.userId));

export const createTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { subject: string; body: string; key: string }) => input)
  .handler(async ({ context, data }) => openTicket(context.userId, data.subject, data.body, data.key));

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => adminOverview(context.userId));

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => claimAdmin(context.userId));

export const adminRates = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listRatesAdmin(context.userId));

export const adminUpdateRate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { id: number; buy: string; sell: string; direction: "up" | "down" | "flat"; demo: boolean; changePct: string }) =>
      input,
  )
  .handler(async ({ context, data }) => {
    await saveRate(context.userId, data);
    return listRatesAdmin(context.userId);
  });

export const adminAddRate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { code: string; nameAr: string; nameEn: string; buy: string; sell: string; region?: string }) => input)
  .handler(async ({ context, data }) => {
    await addRate(context.userId, data);
    return listRatesAdmin(context.userId);
  });

export const adminBranches = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listAllBranches(context.userId));

export const adminSaveBranch = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Branch) => input)
  .handler(async ({ context, data }) => {
    await saveBranch(context.userId, data);
    return listAllBranches(context.userId);
  });

export const adminNews = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listAllNews(context.userId));

export const adminSaveNews = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
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
      published: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await saveNews(context.userId, data);
    return listAllNews(context.userId);
  });

export const adminInquiries = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listInquiries(context.userId));

export const adminInquiryStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; status: string }) => input)
  .handler(async ({ context, data }) => {
    await setInquiryStatus(context.userId, data.id, data.status);
    return listInquiries(context.userId);
  });

export const adminTickets = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listAllTickets(context.userId));

export const adminReplyTicket = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; reply: string; status: string }) => input)
  .handler(async ({ context, data }) => {
    await replyTicket(context.userId, data.id, data.reply, data.status);
    return listAllTickets(context.userId);
  });

export const adminStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listStaff(context.userId));

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { userId: string; role: string }) => input)
  .handler(async ({ context, data }) => {
    await setRole(context.userId, data.userId, data.role);
    return listStaff(context.userId);
  });

export const adminAudit = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listAudit(context.userId));

export const adminSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadSettingsForAdmin(context.userId));

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: SiteSettings) => input)
  .handler(async ({ context, data }) => {
    await saveSettings(context.userId, data);
    return loadSettingsForAdmin(context.userId);
  });

export const adminTransfers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listTransfersAdmin(context.userId));

export const adminCreateTransfer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      reference: string;
      pin: string;
      status: string;
      currency: string;
      amount: string;
      senderName: string;
      beneficiaryName: string;
      pickupCityAr: string;
      pickupCityEn: string;
      demo: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await createTransferAdmin(context.userId, data);
    return listTransfersAdmin(context.userId);
  });

export const adminTransferStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; status: string }) => input)
  .handler(async ({ context, data }) => {
    await setTransferStatus(context.userId, data.id, data.status);
    return listTransfersAdmin(context.userId);
  });

export const adminServices = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listServicesAdmin(context.userId));

export const adminSaveService = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      slug: string;
      summaryAr: string;
      summaryEn: string;
      bodyAr: string;
      bodyEn: string;
      published: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    await saveServiceText(context.userId, data);
    return listServicesAdmin(context.userId);
  });

export const getManagedPage = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data }) => loadManagedPage(data));

export const getJobs = createServerFn({ method: "GET" }).handler(async () => listJobsPublic());

export const submitComplaint = createServerFn({ method: "POST" })
  .validator((input: {
    name: string;
    phone: string;
    email: string;
    topic: string;
    message: string;
    companyWebsite: string;
    idempotencyKey: string;
  }) => input)
  .handler(async ({ data }) => createComplaint(data));

export const lookupComplaint = createServerFn({ method: "POST" })
  .validator((input: { reference: string; pin: string }) => input)
  .handler(async ({ data }) => trackComplaint(data.reference, data.pin));

export const submitApplication = createServerFn({ method: "POST" })
  .validator((input: { jobId: number; name: string; phone: string; email: string; message: string }) => input)
  .handler(async ({ data }) => applyForJob(data));

export const adminPages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listManagedPages(context.userId));

export const adminSavePage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { slug: string; titleAr: string; titleEn: string; bodyAr: string; bodyEn: string; published: boolean; legalApproved?: boolean }) => input)
  .handler(async ({ context, data }) => {
    await saveManagedPage(context.userId, data);
    return listManagedPages(context.userId);
  });

export const adminPartners = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listPartnersAdmin(context.userId));

export const adminSavePartner = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id: number;
    nameAr: string;
    nameEn: string;
    kind: string;
    noteAr: string;
    noteEn: string;
    url: string;
    demo: boolean;
    published: boolean;
  }) => input)
  .handler(async ({ context, data }) => {
    await savePartner(context.userId, data);
    return listPartnersAdmin(context.userId);
  });

export const adminComplaints = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listComplaints(context.userId));

export const adminReplyComplaint = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; reply: string; status: string }) => input)
  .handler(async ({ context, data }) => {
    await replyComplaint(context.userId, data.id, data.reply, data.status);
    return listComplaints(context.userId);
  });

export const adminJobs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listJobsAdmin(context.userId));

export const adminSaveJob = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id: number;
    titleAr: string;
    titleEn: string;
    cityAr: string;
    cityEn: string;
    bodyAr: string;
    bodyEn: string;
    published: boolean;
  }) => input)
  .handler(async ({ context, data }) => {
    await saveJob(context.userId, data);
    return listJobsAdmin(context.userId);
  });

export const adminCustomers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => listCustomers(context.userId));

export const adminNetworksDesk = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadNetworksDesk(context.userId));

export const adminNetworksAct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Record<string, unknown>) => input)
  .handler(async ({ context, data }) => actNetworks(context.userId, data));

