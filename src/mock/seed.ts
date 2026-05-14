import type {
  StockItem, Address, Order, Transaction, Operator, TimeEntry, SettingItem,
} from "@/lib/types";

const rand = (seed: number) => {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
};
const r = rand(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];

const categories = ["Hat", "Zip pull", "Watch Strap", "Wrist watch", "Necklace", "Ring", "Earring", "Bracelet", "Sock"];
const colors = ["Brown", "White", "Black", "Navy", "Pink", "Red", "Grey", "Olive", "Beige"];
const flagsAll = ["Sell Wholesale", "Restock JOE", "Best Sellers", "Special Offer", "Supply Available"];

export const stocks: StockItem[] = Array.from({ length: 48 }, (_, i) => {
  const onHand = Math.floor(r() * 80);
  const reorder = 5 + Math.floor(r() * 10);
  const status = onHand === 0 ? "out" : onHand < reorder ? "low" : "active";
  const cat = pick(categories);
  return {
    id: `s_${i}`,
    code: `JC${66500 + i}`,
    title: `${cat} ${pick(["cotton", "leather", "silver", "crystal", "wool", "steel"])} ${pick(["edition", "classic", "mini", "deluxe"])}`,
    category: cat,
    onHand,
    reorderLevel: reorder,
    color: pick(colors),
    introDate: `2026-${String(1 + Math.floor(r() * 4)).padStart(2, "0")}-${String(1 + Math.floor(r() * 27)).padStart(2, "0")}`,
    costPrice: +(2 + r() * 30).toFixed(2),
    sellingPrice: +(8 + r() * 80).toFixed(2),
    supplierCode: pick(["1236", "1298", "9859", "1429"]),
    status,
    imageHue: Math.floor(r() * 360),
    flags: r() > 0.5 ? [pick(flagsAll)] : [],
    notes: "",
  };
});

const supplierNames = ["V & F COMPANY", "HUMMING J", "TATE ENTERPRISES LTD", "AVEENA MAINA"];
const customerNames = [
  "ARNOLD'S FRONTIER HARDWARE", "STRATFORD BUTTERFLY FARM", "CATHERINE MCGURK",
  "MUSEUM 4 YOU GMBH", "LEEDS ART GALLERY", "NATIONAL SCIENCE & MEDIA MUSEUM",
  "BIRMINGHAM IMAX", "TATE ENTERPRISES (DEL)", "AVEENA MAINA (DEL)", "BRITISH MUSEUM SHOP",
];
const towns = ["YIWU CITY", "LONDON", "LEEDS", "BIRMINGHAM", "MANCHESTER", "BERLIN", "PARIS"];
const countries = ["CHINA", "UK", "GERMANY", "FRANCE", "USA"];

export const addresses: Address[] = [
  ...supplierNames.map((name, i) => ({
    id: `a_s_${i}`,
    code: `${1236 + i * 53}`,
    name, type: "Supplier" as const,
    contact: "Sales", email: `sales@${name.toLowerCase().split(" ")[0]}.co`,
    phone: "+86 555 1234", address1: `${1 + i} Industrial Way`,
    town: pick(towns), region: "ZHEJIANG", zip: "322000", country: pick(countries),
  })),
  ...customerNames.map((name, i) => ({
    id: `a_c_${i}`,
    code: `${11400 + i * 7}`,
    name, type: "Customer" as const,
    contact: "Buyer", email: `buyer@${name.toLowerCase().split(" ")[0].replace("'", "")}.co`,
    phone: "+44 20 7000", address1: `${10 + i} High St`,
    town: pick(towns), region: "", zip: "EC1A", country: pick(countries),
    lastOrder: `2026-04-${String(1 + i).padStart(2, "0")}`,
  })),
];

export const orders: Order[] = Array.from({ length: 18 }, (_, i) => {
  const addr = pick(addresses);
  const lineCount = 1 + Math.floor(r() * 5);
  const lines = Array.from({ length: lineCount }, (_, j) => {
    const item = pick(stocks);
    const qty = 1 + Math.floor(r() * 12);
    return { id: `ol_${i}_${j}`, itemCode: item.code, itemName: item.title, qty, price: item.sellingPrice, per: 1 };
  });
  const status = pick(["Draft", "Confirmed", "Shipped", "Cancelled"] as const);
  return {
    id: `o_${i}`,
    code: `C${99670 + i}`,
    addrType: addr.type, addrCode: addr.code, addrName: addr.name,
    logRef: `C${99670 + i}`,
    ourRef: r() > 0.6 ? `PO-${1000 + i}` : "",
    kind: pick(["REGULAR", "SAMPLE", "BACKORDER"] as const),
    status,
    written: `2026-03-${String(10 + i).padStart(2, "0")}`,
    ship:    `2026-03-${String(15 + i).padStart(2, "0")}`,
    cancel:  `2026-04-${String(10 + i).padStart(2, "0")}`,
    lines,
  };
});

export const transactions: Transaction[] = Array.from({ length: 22 }, (_, i) => {
  const addr = pick(addresses.filter(a => a.type === "Customer"));
  const isPayment = r() > 0.55;
  const value = +((r() * 2000) - (isPayment ? 1500 : 0)).toFixed(2);
  const lineCount = isPayment ? 1 : 1 + Math.floor(r() * 4);
  const each = +(Math.abs(value) / lineCount).toFixed(2);
  const txnLines = Array.from({ length: lineCount }, (_, j) => {
    const item = pick(stocks);
    return {
      id: `tl_${i}_${j}`,
      itemCode: isPayment ? "" : item.code,
      description: isPayment ? "Payment received" : item.title,
      qty: isPayment ? 1 : 1 + Math.floor(r() * 8),
      price: each,
    };
  });
  return {
    id: `t_${i}`,
    refMain: isPayment ? `PMT-${String(20 + i).padStart(5, "0")}` : `INV-${82500 + i}`,
    kind: isPayment ? "Payment" : "Invoice",
    addrCode: addr.code, addrName: addr.name,
    date: `2026-04-${String(1 + i).padStart(2, "0")}`,
    invoicedQty: isPayment ? 0 : 1 + Math.floor(r() * 30),
    balancedQty: isPayment ? 0 : Math.floor(r() * 20),
    lines: lineCount,
    value,
    status: pick(["Open", "Paid", "Partial"] as const),
    tranType: isPayment ? "Sale" as const : "Sale" as const,
    profCentre: pick(["LON", "MCR", "BHX"]),
    taxPeriod: `2026-Q${1 + Math.floor(r() * 4)}`,
    delvDate: `2026-04-${String(2 + i).padStart(2, "0")}`,
    dueDate: `2026-05-${String(1 + i).padStart(2, "0")}`,
    transRef: `TR-${1000 + i}`,
    auditRef: `A-${5000 + i}`,
    agent: pick(["ANUJ", "MIRA", "JOSE"]),
    commPct: 5,
    vatBand: pick(["Standard", "Reduced", "Zero"]),
    ratePct: 20,
    comment: "",
    payTerms: pick(["Net 30", "Net 14", "On Receipt"]),
    currency: "GBP",
    mainCode: addr.code,
    postCode: "EC1A 1AA",
    discountGiven: 0,
    vatCode: "S",
    exclusiveValue: +(Math.abs(value) / 1.2).toFixed(2),
    controlCode: "C001",
    bankAcct: "Main GBP",
    bankCurrency: "GBP",
    standardDays: 30,
    settleDays: 7,
    settleDiscPct: 2.5,
    acctBalance: +(r() * 5000).toFixed(2),
    overdue: +(r() * 1500).toFixed(2),
    txnLines,
    allocations: isPayment
      ? [{ id: `al_${i}_0`, invoiceRef: `INV-${82500 + Math.floor(r() * 22)}`, amount: Math.abs(value) }]
      : [],
  };
});

export const operators: Operator[] = [
  { id: "op_1", code: "ANUJ", name: "Anuj Aggarwal", email: "anuj@bluebash.co", role: "Admin", active: true, lastSeen: "2026-05-04 09:14" },
  { id: "op_2", code: "MIRA", name: "Mira Patel", email: "mira@joecool.co", role: "Manager", active: true, lastSeen: "2026-05-03 17:30" },
  { id: "op_3", code: "JOSE", name: "Jose Silva", email: "jose@joecool.co", role: "Staff", active: true, lastSeen: "2026-05-04 08:02" },
  { id: "op_4", code: "LISA", name: "Lisa Chen", email: "lisa@joecool.co", role: "Staff", active: true, lastSeen: "2026-05-02 12:44" },
  { id: "op_5", code: "TOM",  name: "Tom Wright", email: "tom@joecool.co", role: "Viewer", active: false, lastSeen: "2026-04-12 10:00" },
];

export const timeEntries: TimeEntry[] = Array.from({ length: 18 }, (_, i) => {
  const op = operators[i % operators.length];
  const day = 26 - Math.floor(i / operators.length);
  return {
    id: `te_${i}`,
    operatorCode: op.code, operatorName: op.name,
    date: `2026-04-${String(day).padStart(2, "0")}`,
    inAt: "09:00", outAt: "17:30",
    notes: "",
  };
});

export const settingsCatalog: Record<string, SettingItem[]> = {
  category: categories.map((c, i) => ({ id: `cat_${i}`, code: c.slice(0,3).toUpperCase(), name: c, group: "Stock", meta: c, show: true })),
  colours: colors.map((c, i) => ({ id: `col_${i}`, code: c.slice(0,2).toUpperCase(), name: c, show: true })),
  sizes: ["XS","S","M","L","XL","One Size"].map((s,i) => ({ id:`sz_${i}`, code:s, name:s, show:true })),
  units: ["EA","BOX","PR","SET","PACK"].map((u,i) => ({ id:`u_${i}`, code:u, name:u, show:true })),
  fittings: ["Hook","Clasp","Magnetic","Velcro"].map((f,i)=>({id:`f_${i}`,code:f.slice(0,3).toUpperCase(),name:f,show:true})),
  dimensions: ["Small","Medium","Large"].map((d,i)=>({id:`d_${i}`,code:d.slice(0,1),name:d,show:true})),
  messages: ["Thanks for your order","Sale 10%","Free shipping"].map((m,i)=>({id:`m_${i}`,code:`M${i+1}`,name:m,show:true})),
  displays: ["Counter","Window","Wall"].map((d,i)=>({id:`dp_${i}`,code:d.slice(0,2).toUpperCase(),name:d,show:true})),
  carding: ["Standard Card","Premium Card","No Card"].map((c,i)=>({id:`cd_${i}`,code:`CD${i+1}`,name:c,show:true})),
  costs: ["Landed","FOB","CIF"].map((c,i)=>({id:`co_${i}`,code:c,name:c,show:true})),
  others: ["Tag A","Tag B","Tag C"].map((o,i)=>({id:`o_${i}`,code:`O${i+1}`,name:o,show:true})),
};
