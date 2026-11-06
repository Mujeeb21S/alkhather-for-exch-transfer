import { T as require_jsx_runtime, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as formatMoney } from "./queries.server-CYegzkZO.mjs";
import { lt as useI18n, t as Fa } from "./shell-DdDjRdsi.mjs";
import { T as Route$45 } from "./router-DlFaDcyt.mjs";
import { o as Panel } from "./ui-YTjt0IH-.mjs";
import { t as HeadOfficeFigure } from "./premises-DjG9siaB.mjs";
import { t as PARTNER_GROUPS } from "./partner-groups-Cc26E6Gk.mjs";
import { n as TrackBox, t as Converter } from "./tools-BYCUI5lb.mjs";
import { t as ServiceMenu } from "./services-menu-Dttz2giE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Dqt3ALXr.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const data = Route$45.useLoaderData();
	const { lang, t } = useI18n();
	const text = (ar, en) => lang === "ar" ? ar : en;
	const reasons = [
		[
			"location-dot",
			t("سبع نقاط خدمة", "Seven service points"),
			t("مركز رئيسي في مأرب، وفروع في حريب والمحطة وصافر ومفرق السد وصنعاء وشبوة.", "A head office in Marib, plus Hareeb, the station, Safer, the dam junction, Sana'a, and Shabwa.")
		],
		[
			"shield-halved",
			t("ترخيص موثّق", "A stated license"),
			t("ترخيص رقم 486 صادر عن البنك المركزي اليمني بموجب القانون رقم 14 لسنة 2000.", "License No. 486 from the Central Bank of Yemen, under Law No. 14 of 2000.")
		],
		[
			"lock",
			t("خصوصية الحوالة", "Transfer privacy"),
			t("الاستعلام يُظهر الحالة والعملة ومدينة الاستلام فقط.", "Lookup shows the status, the currency, and the pickup city only.")
		],
		[
			"comment-dots",
			t("شكاوى واضحة", "A clear complaint path"),
			t("قدّم الشكوى واحتفظ برقمها لمتابعتها مع خدمة العملاء.", "File a complaint and keep its number to follow it with customer service.")
		]
	];
	const steps = [
		t("تُنشأ الحوالة في الفرع أو لدى الوكيل، لا من المتصفح.", "The transfer is created at a branch or agent, not in the browser."),
		t("تستلم رقماً مرجعياً ورمز تحقق.", "You receive a reference and a verification code."),
		t("المستفيد يتابع الحالة بعد إدخال الاثنين معاً.", "The beneficiary checks status after entering both."),
		t("الاستلام يتم في نقطة الخدمة بعد التحقق من الهوية.", "Payout happens at the service point after identity is checked.")
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden border-b border-line",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ledger absolute inset-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-12 md:py-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rise text-sm text-gold",
							children: "AL KHADHER EXCHANGE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "rise rise-2 mt-3 font-display text-5xl leading-tight text-ink md:text-6xl",
							children: t("صرافة وتحويلات بوضوحٍ يُعتمد عليه", "Exchange and transfers, stated plainly")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "rise rise-3 mt-5 max-w-xl text-lg text-muted",
							children: t("الخضر للصرافة والتحويلات. تعرّف على الخدمات والفروع، وتابع حالة الحوالة دون كشف أطرافها.", "Al Khadher Exchange. See the services and branches, and follow a transfer without exposing its parties.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/transfers",
									className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm text-surface shadow-soft transition-colors duration-150 hover:bg-primary-mid",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
										name: "magnifying-glass",
										className: "text-gold-soft"
									}), t("استعلام عن حوالة", "Look up a transfer")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/branches",
									className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm shadow-soft transition-colors duration-150 hover:bg-paper",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
										name: "location-dot",
										className: "text-gold"
									}), t("الفروع", "Branches")]
								}),
								data.publication.ratesLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/rates",
									className: "inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-surface px-5 text-sm text-primary shadow-soft",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: "coins" }), t("الأسعار", "Rates")]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-6 flex flex-wrap gap-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 shadow-soft",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
										name: "shield-halved",
										className: "text-gold"
									}), t("ترخيص 486", "License 486")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 shadow-soft",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
										name: "lock",
										className: "text-gold"
									}), t("استعلام بلا كشف الأطراف", "Lookup without party details")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 shadow-soft",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
										name: "bolt",
										className: "text-gold"
									}), t("متابعة من أي جهاز", "Follow up from any device")]
								})
							]
						})
					]
				}), data.publication.ratesLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "soft-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "inline-flex items-center gap-2 font-display text-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
									name: "coins",
									className: "text-gold"
								}), t("أسعار الصرف", "Exchange rates")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: data.rates.find((rate) => !rate.base)?.updatedAt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 grid gap-3",
								children: data.rates.filter((rate) => !rate.base).slice(0, 4).map((rate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between rounded-2xl bg-paper px-3 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: text(rate.nameAr, rate.nameEn)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [rate.code, rate.region ? ` · ${rate.region}` : ""]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-end tabular-nums",
										children: [
											formatMoney(rate.buy),
											" / ",
											formatMoney(rate.sell)
										]
									})]
								}, `${rate.code}-${rate.region}`))
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "soft-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl",
								children: t("متابعة حوالة", "Track a transfer")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 mb-4 text-sm text-muted",
								children: t("أدخل الرقم والرمز معاً. لا تشارك الرمز مع أحد.", "Enter the reference and the code together. Do not share the code.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackBox, {})
						]
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pt-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadOfficeFigure, {
				priority: true,
				caption: t("المركز الرئيسي", "Head office"),
				address: text(data.settings.addressAr, data.settings.addressEn),
				alt: t("واجهة المركز الرئيسي لشركة محسن الخضر للصرافة والتحويلات", "Facade of the Mohsen Al Khadher Exchange head office")
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-6xl gap-4 px-4 py-10 lg:grid-cols-2",
			children: [data.publication.ratesLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-3xl",
				children: t("محول العملات", "Currency converter")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Converter, { rates: data.rates })] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: t("متابعة حوالة", "Track a transfer")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 mb-4 text-sm text-muted",
					children: t("النتيجة حالة وعملة ومدينة استلام. لا أسماء ولا مبلغ.", "The result is status, currency, and pickup city. No names and no amount.")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrackBox, {})
			] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: t("خدماتنا", "Our services")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceMenu, { services: data.services })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-line bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-14",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: t("لماذا الخضر", "Why Al Khadher")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-muted",
						children: t("خدمات في نقاط الشركة، وترخيص معلن، ومتابعة لا تكشف أطراف الحوالة.", "Service at the company's points, a stated license, and follow-up that does not expose the parties.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 grid gap-4 md:grid-cols-2",
						children: reasons.map(([icon, title, body]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "soft-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-11 w-11 place-items-center rounded-2xl bg-primary text-gold-soft",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, { name: icon })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 font-medium",
									children: title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted",
									children: body
								})
							]
						}, title))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl",
				children: t("إرسال واستلام", "Send and receive")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 grid gap-4",
				children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm text-surface tabular-nums",
						children: index + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-1",
						children: step
					})]
				}, step))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: t("شبكة نقاط الخدمة", "Service points")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 grid gap-3",
					children: data.branches.map((branch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "soft-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "inline-flex items-center gap-2 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fa, {
									name: "location-dot",
									className: "text-gold"
								}), text(branch.nameAr, branch.nameEn)]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								text(branch.cityAr, branch.cityEn),
								" — ",
								text(branch.addressAr, branch.addressEn)
							]
						})]
					}, branch.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/branches",
					className: "mt-4 inline-flex text-sm text-primary underline-offset-4 hover:underline",
					children: t("كل الدليل", "Full directory")
				})
			] })]
		}),
		data.partners.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-14",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: t("شركاء التحويل", "Transfer partners")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/partners",
					className: "text-sm text-primary underline-offset-4 hover:underline",
					children: t("كل الشركاء", "All partners")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-6",
				children: PARTNER_GROUPS.filter((group) => group.kind !== "local_circular").map((group) => {
					const items = data.partners.filter((partner) => partner.kind === group.kind);
					if (!items.length) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm text-gold",
						children: text(group.titleAr, group.titleEn)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-wrap gap-2",
						children: items.map((partner) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-full border border-line bg-surface px-3 py-1.5 text-sm",
							children: text(partner.nameAr, partner.nameEn)
						}, partner.id))
					})] }, group.kind);
				})
			})]
		}) : null,
		data.news.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-primary-deep text-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: t("أخبار وإعلانات", "News and notices")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-3",
					children: data.news.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/news/$slug",
						params: { slug: item.slug },
						className: "rounded-2xl border border-white/10 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gold",
								children: item.publishedAt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-2xl",
								children: text(item.titleAr, item.titleEn)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-gold-soft",
								children: text(item.excerptAr, item.excerptEn)
							})
						]
					}, item.slug))
				})]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-3xl",
					children: t("أسئلة متكررة", "Common questions")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 divide-y divide-line rounded-2xl border border-line bg-surface",
					children: data.faqs.slice(0, 4).map((faq) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer font-medium",
							children: text(faq.questionAr, faq.questionEn)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: text(faq.answerAr, faq.answerEn)
						})]
					}, faq.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface px-5 py-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: t("تواصل سريع", "A direct note")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: t("نموذج واحد، ويصل إلى صندوق خدمة العملاء.", "One form, delivered to the customer-service queue.")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						className: "inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm text-surface",
						children: t("افتح النموذج", "Open the form")
					})]
				})
			]
		})
	] });
}
//#endregion
export { Home as component };
