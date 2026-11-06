//#region node_modules/.nitro/vite/services/ssr/assets/labels-Aw3jd-vz.js
var ROLES = [
	"system_admin",
	"content",
	"rates",
	"branches",
	"support",
	"reports",
	"networks_officer",
	"settlements_officer",
	"accountant",
	"finance_manager",
	"operations_manager",
	"transfers_manager",
	"inquiry_officer",
	"customer"
];
var PERMS = {
	system_admin: ["*"],
	content: ["content", "read"],
	rates: ["rates", "read"],
	branches: ["branches", "read"],
	support: ["support", "read"],
	reports: [
		"read",
		"audit",
		"networks"
	],
	customer: [],
	networks_officer: [
		"read",
		"networks",
		"networks_write"
	],
	settlements_officer: [
		"read",
		"networks",
		"networks_money"
	],
	accountant: [
		"read",
		"networks",
		"networks_money",
		"networks_fees"
	],
	finance_manager: [
		"read",
		"networks",
		"networks_write",
		"networks_fees",
		"networks_money",
		"networks_approve"
	],
	operations_manager: [
		"read",
		"networks",
		"networks_write",
		"networks_fees"
	],
	transfers_manager: [
		"read",
		"networks",
		"networks_write"
	],
	inquiry_officer: ["read", "networks"]
};
var ROLE_LABELS = {
	system_admin: ["مدير النظام", "System admin"],
	content: ["مدير المحتوى", "Content"],
	rates: ["مسؤول الأسعار", "Rates"],
	branches: ["مسؤول الفروع", "Branches"],
	support: ["خدمة العملاء", "Support"],
	reports: ["التقارير", "Reports"],
	customer: ["عميل", "Customer"],
	networks_officer: ["مسؤول الشبكات", "Networks"],
	settlements_officer: ["مسؤول التسويات", "Settlements"],
	accountant: ["محاسب", "Accountant"],
	finance_manager: ["المدير المالي", "Finance manager"],
	operations_manager: ["مدير العمليات", "Operations"],
	transfers_manager: ["مدير التحويلات", "Transfers"],
	inquiry_officer: ["الاستعلام", "Inquiry"]
};
var STATUS = {
	draft: ["قيد الإنشاء", "Being created"],
	processing: ["قيد المعالجة", "Processing"],
	sent: ["تم الإرسال", "Sent"],
	ready: ["جاهزة للاستلام", "Ready for pickup"],
	collected: ["تم الاستلام", "Collected"],
	cancelled: ["ملغاة", "Cancelled"],
	rejected: ["مرفوضة", "Rejected"]
};
function can(role, perm) {
	const list = PERMS[role] ?? [];
	return list.includes("*") || list.includes(perm);
}
function roleLabel(role, lang) {
	const pair = ROLE_LABELS[role] ?? [role, role];
	return lang === "ar" ? pair[0] : pair[1];
}
function statusLabel(status, lang) {
	const pair = STATUS[status] ?? ["الحالة", "Status"];
	return lang === "ar" ? pair[0] : pair[1];
}
function newsKindLabel(kind, lang) {
	const pair = {
		alert: ["تنبيه", "Alert"],
		update: ["تحديث", "Update"],
		announcement: ["إعلان", "Notice"],
		news: ["خبر", "News"],
		offer: ["عرض", "Offer"],
		guide: ["إرشاد", "Guide"]
	}[kind] ?? ["خبر", "News"];
	return lang === "ar" ? pair[0] : pair[1];
}
//#endregion
export { statusLabel as a, roleLabel as i, can as n, newsKindLabel as r, ROLES as t };
