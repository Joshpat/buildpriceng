import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// 250025002500 SUPABASE CLIENT 2500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500250025002500
const SUPABASE_URL = "https://uicwxbwrerhugrvldjil.supabase.co";
const SUPABASE_KEY = "sb_publishable_G6WZenHqdN8LwikBjyONhw_kug_CqiG";
const supabase     = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "All Categories","Cement & Concrete","Steel & Iron","Blocks & Bricks",
  "Roofing","Timber & Wood","Tiles & Flooring","Plumbing","Electrical",
  "Paint & Finishes","Aggregates & Sand",
];

const STATES = [
  "All States","Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa",
  "Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu",
  "FCT - Abuja","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi",
  "Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo",
  "Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

const REJECT_REASONS = [
  "Price appears inaccurate or unrealistic",
  "Duplicate entry already exists",
  "Incomplete or missing information",
  "Unrecognised material name",
  "Supplier not found or unverified",
  "Other (see admin notes)",
];

const SEED_PRICES = [
  { id:1,  name:"Dangote Cement (50kg bag)",       category:"Cement & Concrete", unit:"bag",    price:8500,  state:"Lagos",      trend:"up",     change:5.2,  verified:true,  date:"2026-04-15", supplierId:1  },
  { id:2,  name:"Dangote Cement (50kg bag)",       category:"Cement & Concrete", unit:"bag",    price:7900,  state:"Ekiti",      trend:"stable", change:0,    verified:true,  date:"2026-04-16", supplierId:2  },
  { id:3,  name:"BUA Cement (50kg bag)",           category:"Cement & Concrete", unit:"bag",    price:8200,  state:"Lagos",      trend:"up",     change:3.1,  verified:true,  date:"2026-04-15", supplierId:3  },
  { id:4,  name:"9-Inch Sandcrete Block",          category:"Blocks & Bricks",   unit:"block",  price:650,   state:"Lagos",      trend:"up",     change:8.3,  verified:true,  date:"2026-04-14", supplierId:4  },
  { id:5,  name:"9-Inch Sandcrete Block",          category:"Blocks & Bricks",   unit:"block",  price:520,   state:"Ekiti",      trend:"stable", change:0,    verified:false, date:"2026-04-13", supplierId:2  },
  { id:6,  name:"6mm Iron Rod (12m)",              category:"Steel & Iron",       unit:"length", price:4200,  state:"Lagos",      trend:"down",   change:-2.1, verified:true,  date:"2026-04-16", supplierId:5  },
  { id:7,  name:"10mm Iron Rod (12m)",             category:"Steel & Iron",       unit:"length", price:7800,  state:"Lagos",      trend:"up",     change:4.5,  verified:true,  date:"2026-04-15", supplierId:5  },
  { id:8,  name:"12mm Iron Rod (12m)",             category:"Steel & Iron",       unit:"length", price:11200, state:"FCT - Abuja",trend:"up",     change:6.0,  verified:true,  date:"2026-04-16", supplierId:6  },
  { id:9,  name:"Aluzinc Roofing Sheet (0.45mm)", category:"Roofing",            unit:"meter",  price:3800,  state:"Lagos",      trend:"stable", change:0.5,  verified:true,  date:"2026-04-15", supplierId:7  },
  { id:10, name:"Gerard Stone Coated Roof (sqm)", category:"Roofing",            unit:"sqm",    price:18500, state:"Lagos",      trend:"up",     change:7.2,  verified:true,  date:"2026-04-14", supplierId:8  },
  { id:11, name:"2x3 Hardwood Plank (3.6m)",      category:"Timber & Wood",      unit:"piece",  price:2200,  state:"Lagos",      trend:"up",     change:12.5, verified:false, date:"2026-04-12", supplierId:9  },
  { id:12, name:"Granite (20mm, per tonne)",       category:"Aggregates & Sand",  unit:"tonne",  price:28000, state:"Lagos",      trend:"stable", change:1.2,  verified:true,  date:"2026-04-15", supplierId:10 },
  { id:13, name:"Sharp Sand (per tonne)",          category:"Aggregates & Sand",  unit:"tonne",  price:18000, state:"Lagos",      trend:"up",     change:9.1,  verified:true,  date:"2026-04-14", supplierId:11 },
  { id:14, name:"600x600 Porcelain Floor Tile",   category:"Tiles & Flooring",   unit:"sqm",    price:4500,  state:"Lagos",      trend:"stable", change:0,    verified:true,  date:"2026-04-16", supplierId:12 },
  { id:15, name:"Half-Inch PPR Pipe (4m)",        category:"Plumbing",           unit:"length", price:1800,  state:"Ogun",       trend:"down",   change:-1.5, verified:false, date:"2026-04-11", supplierId:13 },
  { id:16, name:"2.5mm Copper Cable (per meter)", category:"Electrical",         unit:"meter",  price:780,   state:"Lagos",      trend:"up",     change:3.8,  verified:true,  date:"2026-04-15", supplierId:14 },
  { id:17, name:"Crown Paints Emulsion (5L)",     category:"Paint & Finishes",   unit:"tin",    price:9500,  state:"Lagos",      trend:"up",     change:5.5,  verified:true,  date:"2026-04-16", supplierId:15 },
  { id:18, name:"Dangote Cement (50kg bag)",       category:"Cement & Concrete", unit:"bag",    price:8100,  state:"Ogun",       trend:"up",     change:4.0,  verified:true,  date:"2026-04-15", supplierId:16 },
];

const SEED_SUPPLIERS = [
  { id:1,  name:"BuildRight Stores",        state:"Lagos",       address:"23 Alaba Int'l Market, Ojo, Lagos",        phone:"0801 234 5678", categories:["Cement & Concrete","Blocks & Bricks","Aggregates & Sand"],  verified:true,  rating:4.7, reviews:43, since:"2018", description:"One of Lagos' leading building materials outlets with a wide range of cement brands and aggregates." },
  { id:2,  name:"Ekiti Building Materials", state:"Ekiti",       address:"Ado-Ekiti Market, Ado-Ekiti, Ekiti",       phone:"0802 345 6789", categories:["Cement & Concrete","Blocks & Bricks","Timber & Wood"],       verified:true,  rating:4.3, reviews:17, since:"2015", description:"Trusted supplier serving Ekiti State with competitive prices on cement and sandcrete blocks." },
  { id:3,  name:"MegaBuild Lagos",          state:"Lagos",       address:"15 Ogba Industrial Estate, Ikeja, Lagos",  phone:"0803 456 7890", categories:["Cement & Concrete","Steel & Iron","Roofing"],                 verified:true,  rating:4.8, reviews:91, since:"2012", description:"Major wholesale distributor for cement, iron rods and roofing in Ikeja corridor." },
  { id:4,  name:"BlockMaster Lagos",        state:"Lagos",       address:"Ikorodu Road, Mile 12, Lagos",             phone:"0804 567 8901", categories:["Blocks & Bricks"],                                            verified:true,  rating:4.5, reviews:28, since:"2019", description:"Specialist block manufacturer. 9-inch and 6-inch sandcrete blocks. Factory-direct pricing." },
  { id:5,  name:"SteelPro Nigeria",         state:"Lagos",       address:"Apapa Steel Complex, Apapa, Lagos",        phone:"0805 678 9012", categories:["Steel & Iron"],                                               verified:true,  rating:4.6, reviews:62, since:"2010", description:"Nigeria's premium iron rod distributor. All sizes available. Bulk supply to project sites." },
  { id:6,  name:"Capital Steel Abuja",      state:"FCT - Abuja", address:"Jabi Steel Market, Jabi, Abuja FCT",      phone:"0806 789 0123", categories:["Steel & Iron"],                                               verified:true,  rating:4.4, reviews:35, since:"2014", description:"Leading steel supplier in the FCT. Serves government and private construction projects." },
  { id:7,  name:"RoofKing Supplies",        state:"Lagos",       address:"Trade Fair Complex, Badagry Expressway",  phone:"0807 890 1234", categories:["Roofing"],                                                    verified:true,  rating:4.5, reviews:54, since:"2016", description:"Specialised roofing materials. Aluzinc, long span, corrugated — all gauges available." },
  { id:8,  name:"Premium Roofing Ltd",      state:"Lagos",       address:"Lekki Phase 1, Lagos",                    phone:"0808 901 2345", categories:["Roofing","Tiles & Flooring"],                                 verified:true,  rating:4.9, reviews:38, since:"2017", description:"High-end roofing and finishing materials. Gerard stone-coated and Decra specialists." },
  { id:9,  name:"Timber World Lagos",       state:"Lagos",       address:"Ojota Timber Market, Lagos",              phone:"0809 012 3456", categories:["Timber & Wood"],                                              verified:false, rating:3.9, reviews:12, since:"2020", description:"Wide range of hardwood and softwood planks. Formwork and decking timber available." },
  { id:10, name:"Quarry Direct Lagos",      state:"Lagos",       address:"Ibeju-Lekki Quarry Access Rd, Lagos",     phone:"0810 123 4567", categories:["Aggregates & Sand"],                                          verified:true,  rating:4.6, reviews:29, since:"2013", description:"Factory-direct granite supply. 10mm, 20mm and 40mm sizes. Tipper load or bulk supply." },
  { id:11, name:"Sand Masters",             state:"Lagos",       address:"Agbara Industrial Estate, Lagos-Badagry", phone:"0811 234 5678", categories:["Aggregates & Sand"],                                          verified:true,  rating:4.2, reviews:21, since:"2016", description:"Sharp sand, plaster sand and fill sand. Site delivery available across greater Lagos." },
  { id:12, name:"TileHouse Nigeria",        state:"Lagos",       address:"Surulere Tiles Market, Lagos",            phone:"0812 345 6789", categories:["Tiles & Flooring"],                                           verified:true,  rating:4.7, reviews:47, since:"2015", description:"Nigeria's widest tile showroom. 300x300 to 1200x1200 formats, all finishes in stock." },
  { id:13, name:"PlumbPro Ogun",            state:"Ogun",        address:"Sagamu Road, Mowe, Ogun State",           phone:"0813 456 7890", categories:["Plumbing"],                                                   verified:false, rating:4.0, reviews:9,  since:"2021", description:"Plumbing materials and sanitary wares. PPR, PVC, UPVC fittings and accessories." },
  { id:14, name:"ElectroBase Lagos",        state:"Lagos",       address:"Computer Village, Ikeja, Lagos",          phone:"0814 567 8901", categories:["Electrical"],                                                 verified:true,  rating:4.5, reviews:33, since:"2014", description:"Full range of electrical cables, conduits, switches and distribution boards." },
  { id:15, name:"Colours & More",           state:"Lagos",       address:"Broad Street, Lagos Island, Lagos",       phone:"0815 678 9012", categories:["Paint & Finishes"],                                           verified:true,  rating:4.8, reviews:56, since:"2011", description:"Authorised Crown Paints and Dulux distributor. Interior and exterior finishes in all colours." },
  { id:16, name:"Ogun BuildMart",           state:"Ogun",        address:"Sango-Otta Market, Sango, Ogun State",    phone:"0816 789 0123", categories:["Cement & Concrete","Aggregates & Sand","Blocks & Bricks"],   verified:true,  rating:4.3, reviews:19, since:"2017", description:"Full-service building materials depot serving Ogun State and border Lagos communities." },
];

// Demo pending submissions so admin panel is not empty on first load
const SEED_PENDING = [
  { id:9001, name:"16mm Iron Rod (12m)", category:"Steel & Iron", unit:"length", price:14500, state:"Rivers", supplierId:null, trend:"stable", change:0, verified:false, date:"2026-04-17", submittedBy:"Chidi Okafor", note:"Bought from Trans-Amadi market today", status:"pending" },
  { id:9002, name:"Interlocking Paving Stone (sqm)", category:"Blocks & Bricks", unit:"sqm", price:12000, state:"Lagos", supplierId:4, trend:"stable", change:0, verified:false, date:"2026-04-17", submittedBy:"Amaka Eze", note:"Project site Lekki Phase 2", status:"pending" },
  { id:9003, name:"Binding Wire (1kg roll)", category:"Steel & Iron", unit:"roll", price:2800, state:"Kano", supplierId:null, trend:"up", change:8.0, verified:false, date:"2026-04-16", submittedBy:"Musa Aliyu", note:"Kano central market", status:"pending" },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

const fmtN = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
const today = () => new Date().toISOString().split("T")[0];

function StarRating({ rating }) {
  const full = Math.floor(rating), half = rating % 1 >= 0.5;
  return (
    <span style={{ color:"#f59e0b", fontSize:13 }}>
      {"★".repeat(full)}{half?"½":""}{"☆".repeat(5-full-(half?1:0))}
      <span style={{ color:"#64748b", fontSize:12, marginLeft:5 }}>{rating}</span>
    </span>
  );
}

function TrendBadge({ trend, change }) {
  const m = {
    up:     { c:"#ef4444", bg:"rgba(239,68,68,.12)",  s:"▲", l:`+${change}%` },
    down:   { c:"#22c55e", bg:"rgba(34,197,94,.12)",  s:"▼", l:`${change}%`  },
    stable: { c:"#f59e0b", bg:"rgba(245,158,11,.12)", s:"●", l:"Stable"      },
  };
  const t = m[trend] || m.stable;
  return <span style={{ background:t.bg, color:t.c, padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700 }}>{t.s} {t.l}</span>;
}

function VerifiedBadge({ verified }) {
  return verified
    ? <span style={{ background:"rgba(14,165,233,.12)", color:"#0ea5e9", padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:700 }}>✓ Verified</span>
    : <span style={{ background:"rgba(148,163,184,.1)", color:"#94a3b8", padding:"2px 9px", borderRadius:20, fontSize:11, fontWeight:600 }}>Unverified</span>;
}

function Pill({ label, color }) {
  const c = color || "#0ea5e9";
  return <span style={{ background:`rgba(${hexToRgb(c)},.1)`, color:c, padding:"3px 9px", borderRadius:20, fontSize:11, fontWeight:600, border:`1px solid rgba(${hexToRgb(c)},.2)` }}>{label}</span>;
}

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "14,165,233";
}

function Modal({ children, onClose, wide=false, full=false }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.80)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(12px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#111827", border:"1px solid rgba(255,255,255,.1)", borderRadius:20,
        padding:28, width:"100%", maxWidth: full ? 900 : wide ? 620 : 480,
        maxHeight:"90vh", overflowY:"auto", boxShadow:"0 40px 100px rgba(0,0,0,.7)",
      }}>
        {children}
      </div>
    </div>
  );
}

function Toast({ msg, type="success" }) {
  const colors = { success:"#22c55e", error:"#ef4444", info:"#0ea5e9" };
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:500, background:"#1e293b", border:`1px solid ${colors[type]}`, borderRadius:12, padding:"14px 20px", display:"flex", alignItems:"center", gap:10, boxShadow:"0 8px 32px rgba(0,0,0,.5)", fontSize:14, fontWeight:600, color:"#f1f5f9", maxWidth:340 }}>
      <span style={{ fontSize:18 }}>{type==="success"?"✅":type==="error"?"❌":"ℹ️"}</span>
      {msg}
    </div>
  );
}

// ─── STYLE TOKENS ─────────────────────────────────────────────────────────────

const inp = { width:"100%", padding:"10px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.05)", color:"#f1f5f9", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" };
const lbl = { fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1.2, marginBottom:6, display:"block" };
const cardBase = { background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:22, transition:"all 0.2s" };

function Btn({ children, onClick, color="#0ea5e9", small=false, outline=false, danger=false }) {
  const bg = danger ? "#ef4444" : color;
  return (
    <button onClick={onClick} style={{
      padding: small ? "7px 14px" : "11px 22px",
      borderRadius:9, border: outline ? `1px solid ${bg}` : "none",
      cursor:"pointer", fontFamily:"inherit", fontWeight:700,
      fontSize: small ? 12 : 14, transition:"all .2s",
      background: outline ? "transparent" : `linear-gradient(135deg,${bg},${bg}cc)`,
      color: outline ? bg : "#fff",
    }}
    onMouseEnter={e=>e.currentTarget.style.opacity=".85"}
    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
      {children}
    </button>
  );
}

// ─── ADMIN PIN ────────────────────────────────────────────────────────────────
const ADMIN_PIN = "1234"; // demo PIN — changeable

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [prices,    setPrices]    = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [pending,   setPending]   = useState([]);
  const [rejected,  setRejected]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [anim,      setAnim]      = useState(false);

  const [tab,       setTab]       = useState("directory");
  const [adminMode, setAdminMode] = useState(false);
  const [pinInput,  setPinInput]  = useState("");
  const [pinError,  setPinError]  = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  // Price filters
  const [search, setSearch] = useState("");
  const [cat,    setCat]    = useState("All Categories");
  const [st,     setSt]     = useState("All States");
  const [sort,   setSort]   = useState("date");

  // Supplier filters
  const [sSearch, setSSearch] = useState("");
  const [sSt,     setSSt]     = useState("All States");
  const [sCat,    setSCat]    = useState("All Categories");

  // Admin queue state
  const [queueFilter,    setQueueFilter]    = useState("pending");
  const [selectedSub,    setSelectedSub]    = useState(null);
  const [rejectReason,   setRejectReason]   = useState(REJECT_REASONS[0]);
  const [rejectNote,     setRejectNote]     = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [editSub,        setEditSub]        = useState(null);

  // Modals
  const [pModal, setPModal] = useState(null);
  const [sModal, setSModal] = useState(null);

  // Submit form
  const [form,        setForm]        = useState({ name:"", category:"", unit:"", price:"", state:"", supplierId:"", submittedBy:"", note:"" });
  const [subOk,       setSubOk]       = useState(false);

  // Estimate calculator
  const [estState,    setEstState]    = useState("Lagos");
  const [estProject,  setEstProject]  = useState("");
  const [estItems,    setEstItems]    = useState([
    { id:1, priceId:null, customName:"", qty:1, unit:"", unitPrice:0, note:"" },
  ]);
  const [estContingency, setEstContingency] = useState(10);
  const [estVAT,          setEstVAT]        = useState(7.5);
  const [showEstResult,   setShowEstResult] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Supabase: load all data ──
  const loadData = useCallback(async () => {
    try {
      const [{ data: pricesData }, { data: suppliersData }, { data: pendingData }, { data: rejectedData }] = await Promise.all([
        supabase.from("prices").select("*").order("date", { ascending: false }),
        supabase.from("suppliers").select("*").order("name"),
        supabase.from("pending").select("*").order("created_at", { ascending: false }),
        supabase.from("rejected").select("*").order("created_at", { ascending: false }),
      ]);
      // Seed if empty
      if (!pricesData || pricesData.length === 0) {
        const seedPrices = SEED_PRICES.map(({ id, supplierId, ...rest }) => ({ ...rest, supplier_id: supplierId }));
        await supabase.from("prices").insert(seedPrices);
        const { data: fresh } = await supabase.from("prices").select("*").order("date", { ascending: false });
        setPrices((fresh || []).map(normalizePrice));
      } else {
        setPrices((pricesData || []).map(normalizePrice));
      }
      if (!suppliersData || suppliersData.length === 0) {
        const seedSups = SEED_SUPPLIERS.map(({ id, ...rest }) => rest);
        await supabase.from("suppliers").insert(seedSups);
        const { data: fresh } = await supabase.from("suppliers").select("*").order("name");
        setSuppliers((fresh || []).map(normalizeSupplier));
      } else {
        setSuppliers((suppliersData || []).map(normalizeSupplier));
      }
      setPending((pendingData || []).map(normalizePending));
      setRejected((rejectedData || []).map(normalizeRejected));
    } catch(e) {
      console.error("Supabase load error:", e);
      setPrices(SEED_PRICES); setSuppliers(SEED_SUPPLIERS);
      setPending(SEED_PENDING); setRejected([]);
    }
    setLoading(false);
    setTimeout(() => setAnim(true), 60);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Normalise DB rows to app format ──
  const normalizePrice    = (r) => ({ ...r, supplierId: r.supplier_id, verified: r.verified ?? false });
  const normalizeSupplier = (r) => ({ ...r, categories: r.categories || [] });
  const normalizePending  = (r) => ({ ...r, supplierId: r.supplier_id, submittedBy: r.submitted_by, note: r.note || "" });
  const normalizeRejected = (r) => ({ ...r, rejectedReason: r.rejected_reason, rejectedNote: r.rejected_note });

  // legacy save stub — no longer used for storage, kept for compatibility
  const save = async () => {};

  const supOf = (p) => suppliers.find(s => s.id === p.supplierId);

  // ── Filtered prices ──
  const filtPrices = prices
    .filter(p => {
      const sup = supOf(p);
      return (p.name.toLowerCase().includes(search.toLowerCase()) || (sup?.name||"").toLowerCase().includes(search.toLowerCase()))
        && (cat === "All Categories" || p.category === cat)
        && (st  === "All States"     || p.state    === st);
    })
    .sort((a,b) => sort==="price_asc" ? a.price-b.price : sort==="price_desc" ? b.price-a.price : new Date(b.date)-new Date(a.date));

  const filtSups = suppliers.filter(s =>
    s.name.toLowerCase().includes(sSearch.toLowerCase()) &&
    (sSt  === "All States"     || s.state === sSt) &&
    (sCat === "All Categories" || s.categories.includes(sCat))
  );

  const stats = {
    prices:   prices.length,
    verified: prices.filter(p=>p.verified).length,
    sups:     suppliers.length,
    states:   [...new Set(prices.map(p=>p.state))].length,
    pending:  pending.length,
  };

  // ── Submit public price ──
  const handleSubmit = async () => {
    if (!form.name||!form.price||!form.state||!form.category) return;
    const entry = {
      name: form.name, category: form.category, unit: form.unit,
      price: parseInt(form.price), state: form.state,
      supplier_id: form.supplierId ? parseInt(form.supplierId) : null,
      submitted_by: form.submittedBy, note: form.note,
      trend:"stable", change:0, verified:false, status:"pending",
    };
    const { error } = await supabase.from("pending").insert([entry]);
    if (!error) {
      setSubOk(true);
      setForm({ name:"", category:"", unit:"", price:"", state:"", supplierId:"", submittedBy:"", note:"" });
      await loadData();
      setTimeout(() => { setSubOk(false); setTab("directory"); }, 2800);
    } else {
      showToast("Submission failed. Please try again.", "error");
    }
  };

  // ── Admin: Approve ──
  const handleApprove = async (item) => {
    const priceRow = {
      name: item.name, category: item.category, unit: item.unit,
      price: item.price, state: item.state,
      supplier_id: item.supplierId || item.supplier_id || null,
      trend: item.trend || "stable", change: item.change || 0,
      verified: true, date: today(),
    };
    await supabase.from("prices").insert([priceRow]);
    await supabase.from("pending").delete().eq("id", item.id);
    await loadData();
    setSelectedSub(null); setShowRejectForm(false);
    showToast(`"${item.name}" approved and published ✓`);
  };

  // ── Admin: Approve with edits ──
  const handleApproveEdit = async () => {
    if (!editSub) return;
    const priceRow = {
      name: editSub.name, category: editSub.category, unit: editSub.unit,
      price: parseInt(editSub.price), state: editSub.state,
      supplier_id: editSub.supplierId || editSub.supplier_id || null,
      trend: editSub.trend || "stable", change: editSub.change || 0,
      verified: true, date: today(),
    };
    await supabase.from("prices").insert([priceRow]);
    await supabase.from("pending").delete().eq("id", editSub.id);
    await loadData();
    setEditSub(null); setSelectedSub(null);
    showToast(`"${editSub.name}" edited & published ✓`);
  };

  // ── Admin: Reject ──
  const handleReject = async (item) => {
    const rejRow = {
      name: item.name, category: item.category, unit: item.unit,
      price: item.price, state: item.state, date: item.date,
      submitted_by: item.submittedBy || item.submitted_by,
      note: item.note,
      rejected_reason: rejectReason,
      rejected_note: rejectNote,
    };
    await supabase.from("rejected").insert([rejRow]);
    await supabase.from("pending").delete().eq("id", item.id);
    await loadData();
    setSelectedSub(null); setShowRejectForm(false); setRejectNote("");
    showToast("Submission rejected", "error");
  };

  // ── Admin: Delete from live prices ──
  const handleDeletePrice = async (id) => {
    await supabase.from("prices").delete().eq("id", id);
    await loadData();
    showToast("Price removed from directory", "info");
  };

  // ── PIN auth ──
  const tryPin = () => {
    if (pinInput === ADMIN_PIN) {
      setAdminMode(true); setShowPinModal(false); setPinInput(""); setPinError(false);
      setTab("admin");
    } else {
      setPinError(true);
    }
  };

  const TABS = [
    { key:"directory", label:"📋 Prices"     },
    { key:"suppliers", label:"🏪 Suppliers"  },
    { key:"estimate",  label:"🧮 Estimator"  },
    { key:"submit",    label:"+ Submit"      },
    { key:"admin",     label:"⚙ Admin", admin:true },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#090e1a", fontFamily:"'DM Sans','Segoe UI',sans-serif", color:"#f1f5f9" }}>

      {/* Ambient */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
        background:"radial-gradient(ellipse at 15% 8%, rgba(14,165,233,.07) 0%, transparent 50%), radial-gradient(ellipse at 85% 90%, rgba(245,158,11,.05) 0%, transparent 50%)" }} />

      {/* ── HEADER ── */}
      <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(9,14,26,.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,.06)", padding:"0 24px" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:62 }}>
          <div style={{ display:"flex", alignItems:"center", gap:11 }}>
            <div style={{ width:34, height:34, borderRadius:8, background:"linear-gradient(135deg,#0ea5e9,#f59e0b)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>⚒</div>
            <div>
              <div style={{ fontWeight:800, fontSize:16, letterSpacing:-.5, lineHeight:1 }}>BuildPrice <span style={{ color:"#0ea5e9" }}>NG</span></div>
              <div style={{ fontSize:9, color:"#475569", letterSpacing:1.1, textTransform:"uppercase" }}>Nigeria Construction Price Index</div>
            </div>
          </div>
          <nav style={{ display:"flex", gap:3, alignItems:"center" }}>
            {TABS.map(t => {
              if (t.admin && !adminMode) return (
                <button key="admin-lock" onClick={()=>setShowPinModal(true)} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid rgba(255,255,255,.1)", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", background:"rgba(255,255,255,.04)", color:"#64748b", display:"flex", alignItems:"center", gap:6, position:"relative" }}>
                  🔒 Admin
                  {stats.pending > 0 && <span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"#fff", borderRadius:10, fontSize:10, fontWeight:800, padding:"1px 5px", minWidth:16, textAlign:"center" }}>{stats.pending}</span>}
                </button>
              );
              return (
                <button key={t.key} onClick={()=>setTab(t.key)} style={{
                  padding:"7px 15px", borderRadius:8, border:"none", cursor:"pointer",
                  fontSize:13, fontWeight:600, fontFamily:"inherit", transition:"all .2s",
                  background: tab===t.key ? "rgba(14,165,233,.15)" : "transparent",
                  color:       tab===t.key ? "#0ea5e9"              : "#64748b",
                  position:"relative",
                }}>
                  {t.label}
                  {t.admin && stats.pending>0 && <span style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"#fff", borderRadius:10, fontSize:10, fontWeight:800, padding:"1px 5px", minWidth:16, textAlign:"center" }}>{stats.pending}</span>}
                </button>
              );
            })}
            {adminMode && <button onClick={()=>{setAdminMode(false);setTab("directory");}} style={{ padding:"5px 10px", borderRadius:7, border:"1px solid rgba(239,68,68,.3)", background:"rgba(239,68,68,.08)", color:"#ef4444", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Exit Admin</button>}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth:1200, margin:"0 auto", padding:"28px 24px", position:"relative", zIndex:1 }}>

        {/* HERO */}
        <div style={{ opacity:anim?1:0, transform:anim?"translateY(0)":"translateY(16px)", transition:"all .6s cubic-bezier(.16,1,.3,1)", marginBottom:28 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2.2, color:"#0ea5e9", textTransform:"uppercase", marginBottom:7 }}>Live Price Intelligence</div>
          <h1 style={{ fontSize:"clamp(22px,3.8vw,40px)", fontWeight:900, margin:0, lineHeight:1.1, letterSpacing:-1.5 }}>
            Nigeria's Construction<br/>
            <span style={{ background:"linear-gradient(90deg,#0ea5e9,#f59e0b)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Materials Price Index</span>
          </h1>
          <p style={{ color:"#475569", marginTop:8, fontSize:14, maxWidth:490 }}>
            Crowd-verified pricing & verified supplier contacts across all 36 states. Built for engineers, QS & contractors.
          </p>
        </div>

        {/* STATS */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:11, marginBottom:28, opacity:anim?1:0, transition:"all .6s .1s" }}>
          {[
            { label:"Price Listings",   val:stats.prices,   icon:"📋", c:"#0ea5e9" },
            { label:"Verified Prices",  val:stats.verified, icon:"✓",  c:"#22c55e" },
            { label:"Listed Suppliers", val:stats.sups,     icon:"🏪", c:"#f59e0b" },
            { label:"States Covered",   val:stats.states,   icon:"🗺", c:"#a855f7" },
            { label:"Awaiting Review",  val:stats.pending,  icon:"⏳", c:"#ef4444" },
          ].map((s,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,.03)", border:`1px solid ${i===4&&s.val>0?"rgba(239,68,68,.25)":"rgba(255,255,255,.07)"}`, borderRadius:12, padding:"14px 16px" }}>
              <div style={{ fontSize:16, marginBottom:3 }}>{s.icon}</div>
              <div style={{ fontSize:22, fontWeight:900, color:s.c, letterSpacing:-1 }}>{s.val}</div>
              <div style={{ fontSize:11, color:"#475569", fontWeight:600, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ══════════ PRICE DIRECTORY ══════════ */}
        {tab==="directory" && (
          <>
            <FilterBar>
              <FilterCol span={2}><label style={lbl}>Search</label><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="material or supplier…" style={inp}/></FilterCol>
              <FilterCol><label style={lbl}>Category</label><select value={cat} onChange={e=>setCat(e.target.value)} style={inp}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></FilterCol>
              <FilterCol><label style={lbl}>State</label><select value={st} onChange={e=>setSt(e.target.value)} style={inp}>{STATES.map(s=><option key={s}>{s}</option>)}</select></FilterCol>
              <FilterCol><label style={lbl}>Sort</label><select value={sort} onChange={e=>setSort(e.target.value)} style={inp}><option value="date">Latest</option><option value="price_asc">Price ↑</option><option value="price_desc">Price ↓</option></select></FilterCol>
            </FilterBar>
            <div style={{ marginBottom:16, fontSize:12, color:"#475569" }}>Showing <span style={{ color:"#0ea5e9", fontWeight:700 }}>{filtPrices.length}</span> of {prices.length}</div>

            {loading ? <Loader/> : filtPrices.length===0 ? <Empty icon="🔍" msg="No results. Adjust filters."/> : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:14 }}>
                {filtPrices.map((item,i)=>{
                  const sup=supOf(item);
                  return (
                    <div key={item.id} onClick={()=>setPModal(item)} style={{ ...cardBase, cursor:"pointer", opacity:anim?1:0, transform:anim?"none":"translateY(12px)", transitionDelay:`${.035*(i%12)}s` }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(14,165,233,.35)";e.currentTarget.style.background="rgba(14,165,233,.04)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.background="rgba(255,255,255,.03)";}}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
                        <span style={{ fontSize:11, fontWeight:600, color:"#0ea5e9", background:"rgba(14,165,233,.1)", padding:"3px 8px", borderRadius:6 }}>{item.category}</span>
                        <TrendBadge trend={item.trend} change={item.change}/>
                      </div>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:4, lineHeight:1.3 }}>{item.name}</div>
                      <div style={{ display:"flex", alignItems:"baseline", gap:5, marginBottom:11 }}>
                        <span style={{ fontSize:24, fontWeight:900, color:"#f1f5f9", letterSpacing:-1 }}>{fmtN(item.price)}</span>
                        <span style={{ fontSize:12, color:"#64748b" }}>/ {item.unit}</span>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:"1px solid rgba(255,255,255,.05)" }}>
                        <div>
                          <div style={{ fontSize:12, color:"#94a3b8", fontWeight:600 }}>📍 {item.state}</div>
                          {sup && <button onClick={e=>{e.stopPropagation();setSModal(sup);}} style={{ background:"none",border:"none",padding:0,cursor:"pointer",fontSize:11,color:"#0ea5e9",marginTop:2,fontFamily:"inherit",textDecoration:"underline" }}>🏪 {sup.name}</button>}
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <VerifiedBadge verified={item.verified}/>
                          <div style={{ fontSize:10, color:"#475569", marginTop:3 }}>{item.date}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══════════ SUPPLIER DIRECTORY ══════════ */}
        {tab==="suppliers" && (
          <>
            <FilterBar cols={3}>
              <FilterCol span={2}><label style={lbl}>Search Suppliers</label><input value={sSearch} onChange={e=>setSSearch(e.target.value)} placeholder="name or market…" style={inp}/></FilterCol>
              <FilterCol><label style={lbl}>State</label><select value={sSt} onChange={e=>setSSt(e.target.value)} style={inp}>{STATES.map(s=><option key={s}>{s}</option>)}</select></FilterCol>
              <FilterCol><label style={lbl}>Specialisation</label><select value={sCat} onChange={e=>setSCat(e.target.value)} style={inp}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></FilterCol>
            </FilterBar>
            <div style={{ marginBottom:16, fontSize:12, color:"#475569" }}>Showing <span style={{ color:"#f59e0b", fontWeight:700 }}>{filtSups.length}</span> of {suppliers.length} suppliers</div>

            {filtSups.length===0 ? <Empty icon="🏪" msg="No suppliers found."/> : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:14 }}>
                {filtSups.map((sup,i)=>{
                  const spP=prices.filter(p=>p.supplierId===sup.id);
                  return (
                    <div key={sup.id} onClick={()=>setSModal(sup)} style={{ ...cardBase, cursor:"pointer", opacity:anim?1:0, transitionDelay:`${.035*(i%12)}s` }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(245,158,11,.35)";e.currentTarget.style.background="rgba(245,158,11,.03)";}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.07)";e.currentTarget.style.background="rgba(255,255,255,.03)";}}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:11 }}>
                        <div style={{ width:42,height:42,borderRadius:10,background:"linear-gradient(135deg,rgba(245,158,11,.2),rgba(14,165,233,.2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19 }}>🏪</div>
                        <VerifiedBadge verified={sup.verified}/>
                      </div>
                      <div style={{ fontWeight:800, fontSize:15, marginBottom:2 }}>{sup.name}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginBottom:8 }}>📍 {sup.state} · Est. {sup.since}</div>
                      <StarRating rating={sup.rating}/>
                      <span style={{ fontSize:11, color:"#475569", marginLeft:5 }}>({sup.reviews} reviews)</span>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:5, margin:"10px 0" }}>{sup.categories.map(c=><Pill key={c} label={c}/>)}</div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10, borderTop:"1px solid rgba(255,255,255,.05)" }}>
                        <span style={{ fontSize:12, color:"#475569" }}>{spP.length} listing{spP.length!==1?"s":""}</span>
                        <span style={{ fontSize:12, color:"#0ea5e9", fontWeight:600 }}>View Profile →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ══════════ ESTIMATE CALCULATOR ══════════ */}
        {tab==="estimate" && (
          <EstimateCalculator
            prices={prices}
            suppliers={suppliers}
            estState={estState} setEstState={setEstState}
            estProject={estProject} setEstProject={setEstProject}
            estItems={estItems} setEstItems={setEstItems}
            estContingency={estContingency} setEstContingency={setEstContingency}
            estVAT={estVAT} setEstVAT={setEstVAT}
            showEstResult={showEstResult} setShowEstResult={setShowEstResult}
          />
        )}

        {/* ══════════ SUBMIT PRICE ══════════ */}
        {tab==="submit" && (
          <div style={{ maxWidth:600, margin:"0 auto", ...cardBase, padding:34 }}>
            <h2 style={{ margin:"0 0 5px", fontWeight:800, fontSize:21 }}>Submit a Price</h2>
            <p style={{ color:"#64748b", fontSize:14, marginBottom:24 }}>
              Help keep the index accurate. Your submission enters an admin review queue before going live.
            </p>

            {/* Submission flow banner */}
            <div style={{ display:"flex", gap:0, marginBottom:26, borderRadius:10, overflow:"hidden", border:"1px solid rgba(255,255,255,.07)" }}>
              {[
                { icon:"📝", label:"You Submit" },
                { icon:"⏳", label:"Admin Reviews" },
                { icon:"✅", label:"Goes Live" },
              ].map((s,i)=>(
                <div key={i} style={{ flex:1, background:i===1?"rgba(14,165,233,.07)":"rgba(255,255,255,.02)", padding:"10px 0", textAlign:"center", borderRight:i<2?"1px solid rgba(255,255,255,.07)":"none" }}>
                  <div style={{ fontSize:17, marginBottom:2 }}>{s.icon}</div>
                  <div style={{ fontSize:11, fontWeight:600, color:i===1?"#0ea5e9":"#475569" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {subOk ? (
              <div style={{ textAlign:"center", padding:40 }}>
                <div style={{ fontSize:52, marginBottom:10 }}>📬</div>
                <div style={{ fontWeight:800, fontSize:19 }}>Submission Received!</div>
                <div style={{ color:"#64748b", fontSize:14, marginTop:6, lineHeight:1.6 }}>Your price is now in the admin review queue.<br/>It will be published once verified.</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:15 }}>
                <div><label style={lbl}>Material Name *</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Dangote Cement 50kg bag" style={inp}/></div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
                  <div><label style={lbl}>Category *</label>
                    <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={inp}>
                      <option value="">Select category</option>{CATEGORIES.slice(1).map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div><label style={lbl}>Unit</label><input value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} placeholder="bag, piece, meter…" style={inp}/></div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
                  <div><label style={lbl}>Price (₦) *</label><input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} placeholder="e.g. 8500" style={inp}/></div>
                  <div><label style={lbl}>State *</label>
                    <select value={form.state} onChange={e=>setForm(f=>({...f,state:e.target.value}))} style={inp}>
                      <option value="">Select state</option>{STATES.slice(1).map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div><label style={lbl}>Link to Supplier (Optional)</label>
                  <select value={form.supplierId} onChange={e=>setForm(f=>({...f,supplierId:e.target.value}))} style={inp}>
                    <option value="">Select supplier (optional)</option>
                    {suppliers.map(s=><option key={s.id} value={s.id}>{s.name} — {s.state}</option>)}
                  </select>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:13 }}>
                  <div><label style={lbl}>Your Name (Optional)</label><input value={form.submittedBy} onChange={e=>setForm(f=>({...f,submittedBy:e.target.value}))} placeholder="e.g. Emeka Nwosu" style={inp}/></div>
                  <div><label style={lbl}>Notes (Optional)</label><input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} placeholder="e.g. bought today at Alaba" style={inp}/></div>
                </div>
                <Btn onClick={handleSubmit}>Submit for Review →</Btn>
              </div>
            )}
          </div>
        )}

        {/* ══════════ ADMIN DASHBOARD ══════════ */}
        {tab==="admin" && adminMode && (
          <div>
            {/* Dashboard header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <div>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#ef4444", textTransform:"uppercase", marginBottom:4 }}>Admin Dashboard</div>
                <h2 style={{ margin:0, fontWeight:900, fontSize:22 }}>BuildPrice NG — Control Centre</h2>
                <div style={{ fontSize:12, color:"#475569", marginTop:3 }}>System health, analytics & submission review queue</div>
              </div>
              <div style={{ fontSize:11, color:"#475569", textAlign:"right" }}>
                <div>Last updated</div>
                <div style={{ color:"#0ea5e9", fontWeight:700 }}>{new Date().toLocaleString("en-NG",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
              </div>
            </div>

            {/* ── KPI CARDS ── */}
            {(()=>{
              const totalValue = prices.reduce((s,p)=>s+p.price,0);
              const avgPrice   = prices.length ? Math.round(totalValue/prices.length) : 0;
              const risingCount = prices.filter(p=>p.trend==="up").length;
              const fallingCount = prices.filter(p=>p.trend==="down").length;
              const approvalRate = (prices.length+rejected.length)>0 ? Math.round(prices.length/(prices.length+rejected.length)*100) : 0;
              return (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12, marginBottom:24 }}>
                  {[
                    { label:"Total Listings",    val:prices.length,     icon:"📋", c:"#0ea5e9", sub:"live in directory" },
                    { label:"Verified Prices",   val:prices.filter(p=>p.verified).length, icon:"✓", c:"#22c55e", sub:`${Math.round(prices.filter(p=>p.verified).length/Math.max(prices.length,1)*100)}% of total` },
                    { label:"Suppliers Listed",  val:suppliers.length,  icon:"🏪", c:"#f59e0b", sub:`${suppliers.filter(s=>s.verified).length} verified` },
                    { label:"States Covered",    val:[...new Set(prices.map(p=>p.state))].length, icon:"🗺", c:"#a855f7", sub:"of 37 total" },
                    { label:"Prices Rising",     val:risingCount,       icon:"▲", c:"#ef4444", sub:`${fallingCount} falling` },
                    { label:"Pending Review",    val:pending.length,    icon:"⏳", c:"#f59e0b", sub:`${rejected.length} rejected` },
                    { label:"Approval Rate",     val:`${approvalRate}%`,icon:"✅", c:"#22c55e", sub:"submissions approved" },
                    { label:"Avg. Unit Price",   val:fmtN(avgPrice),    icon:"₦",  c:"#0ea5e9", sub:"across all listings" },
                  ].map((s,i)=>(
                    <div key={i} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                        <span style={{ fontSize:18 }}>{s.icon}</span>
                        <span style={{ fontSize:10, color:"#475569" }}>{s.sub}</span>
                      </div>
                      <div style={{ fontSize:i===7?16:22, fontWeight:900, color:s.c, letterSpacing:-1, lineHeight:1 }}>{s.val}</div>
                      <div style={{ fontSize:11, color:"#475569", fontWeight:600, marginTop:4 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* ── ANALYTICS ROW ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16, marginBottom:24 }}>

              {/* Category distribution */}
              {(()=>{
                const cats = {};
                prices.forEach(p=>{ cats[p.category]=(cats[p.category]||0)+1; });
                const sorted = Object.entries(cats).sort((a,b)=>b[1]-a[1]);
                const total  = prices.length;
                const colors = ["#0ea5e9","#f59e0b","#22c55e","#a855f7","#ef4444","#06b6d4","#f97316","#84cc16","#e879f9","#34d399"];
                return (
                  <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Listings by Category</div>
                    {sorted.map(([cat,count],i)=>{
                      const pct = total>0?Math.round(count/total*100):0;
                      return (
                        <div key={cat} style={{ marginBottom:10 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}>
                            <span style={{ color:"#94a3b8" }}>{cat}</span>
                            <span style={{ color:"#f1f5f9", fontWeight:700 }}>{count} <span style={{ color:"#475569", fontWeight:400 }}>({pct}%)</span></span>
                          </div>
                          <div style={{ background:"rgba(255,255,255,.06)", borderRadius:3, height:5 }}>
                            <div style={{ height:"100%", width:`${pct}%`, background:colors[i%colors.length], borderRadius:3, transition:"width .5s" }}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Price trend summary */}
              {(()=>{
                const rising  = prices.filter(p=>p.trend==="up").length;
                const falling = prices.filter(p=>p.trend==="down").length;
                const stable  = prices.filter(p=>p.trend==="stable").length;
                const total   = prices.length || 1; // eslint-disable-line no-unused-vars
                const topRising = [...prices].filter(p=>p.trend==="up").sort((a,b)=>b.change-a.change).slice(0,4);
                return (
                  <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Market Sentiment</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:16 }}>
                      {[
                        { label:"Rising",  val:rising,  c:"#ef4444", icon:"▲" },
                        { label:"Stable",  val:stable,  c:"#f59e0b", icon:"●" },
                        { label:"Falling", val:falling, c:"#22c55e", icon:"▼" },
                      ].map((t,i)=>(
                        <div key={i} style={{ background:`rgba(${hexToRgb(t.c)},.08)`, border:`1px solid rgba(${hexToRgb(t.c)},.15)`, borderRadius:9, padding:"10px 0", textAlign:"center" }}>
                          <div style={{ fontSize:16, color:t.c }}>{t.icon}</div>
                          <div style={{ fontSize:20, fontWeight:900, color:t.c, letterSpacing:-1 }}>{t.val}</div>
                          <div style={{ fontSize:10, color:"#64748b", fontWeight:600 }}>{t.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:.8, marginBottom:8 }}>Fastest Rising</div>
                    {topRising.map(p=>(
                      <div key={p.id} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:12 }}>
                        <span style={{ color:"#94a3b8" }}>{p.name.length>24?p.name.slice(0,24)+"…":p.name}</span>
                        <span style={{ color:"#ef4444", fontWeight:700 }}>▲ +{p.change}%</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* State coverage + top suppliers */}
              {(()=>{
                const stateCounts = {};
                prices.forEach(p=>{ stateCounts[p.state]=(stateCounts[p.state]||0)+1; });
                const topStates = Object.entries(stateCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);
                const topSuppliers = [...suppliers].sort((a,b)=>b.rating-a.rating).slice(0,4);
                return (
                  <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Top States by Listings</div>
                    {topStates.map(([state,count],i)=>(
                      <div key={state} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:12 }}>
                        <span style={{ color:"#94a3b8" }}>📍 {state}</span>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:50, background:"rgba(255,255,255,.06)", borderRadius:3, height:4 }}>
                            <div style={{ width:`${Math.round(count/prices.length*100)}%`, background:"#a855f7", height:"100%", borderRadius:3 }}/>
                          </div>
                          <span style={{ color:"#f1f5f9", fontWeight:700, minWidth:16, textAlign:"right" }}>{count}</span>
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:.8, margin:"14px 0 10px" }}>Top Rated Suppliers</div>
                    {topSuppliers.map(s=>(
                      <div key={s.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:12 }}>
                        <span style={{ color:"#94a3b8" }}>{s.name}</span>
                        <span style={{ color:"#f59e0b", fontWeight:700 }}>★ {s.rating}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* ── SYSTEM HEALTH ── */}
            {(()=>{
              const unverifiedPrices    = prices.filter(p=>!p.verified).length;
              const unverifiedSuppliers = suppliers.filter(s=>!s.verified).length;
              const oldPrices           = prices.filter(p=>{ const d=new Date(p.date); const diff=(new Date()-d)/(1000*60*60*24); return diff>30; }).length;
              const healthItems = [
                { label:"Unverified price listings",      val:unverifiedPrices,    target:0,  c: unverifiedPrices===0?"#22c55e":"#f59e0b",    action:"Review in price table below" },
                { label:"Unverified suppliers",           val:unverifiedSuppliers, target:0,  c: unverifiedSuppliers===0?"#22c55e":"#ef4444", action:"Check Suppliers tab" },
                { label:"Submissions pending review",     val:pending.length,      target:0,  c: pending.length===0?"#22c55e":"#f59e0b",       action:"See queue below" },
                { label:"Prices older than 30 days",      val:oldPrices,           target:0,  c: oldPrices===0?"#22c55e":"#94a3b8",            action:"Consider requesting updates" },
              ];
              const score = Math.round((healthItems.filter(h=>h.val===0).length/healthItems.length)*100);
              return (
                <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20, marginBottom:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1 }}>System Health</div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ fontSize:11, color:"#64748b" }}>Health Score</div>
                      <div style={{ fontSize:20, fontWeight:900, color:score===100?"#22c55e":score>=50?"#f59e0b":"#ef4444" }}>{score}%</div>
                      <div style={{ width:80, height:6, background:"rgba(255,255,255,.06)", borderRadius:3 }}>
                        <div style={{ width:`${score}%`, height:"100%", background:score===100?"#22c55e":score>=50?"#f59e0b":"#ef4444", borderRadius:3, transition:"width .6s" }}/>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {healthItems.map((h,i)=>(
                      <div key={i} style={{ background:"rgba(255,255,255,.03)", border:`1px solid rgba(${hexToRgb(h.c)},.2)`, borderRadius:10, padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600, color:"#f1f5f9" }}>{h.label}</div>
                          <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{h.action}</div>
                        </div>
                        <div style={{ fontSize:22, fontWeight:900, color:h.c, letterSpacing:-1, marginLeft:12 }}>{h.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── SUBMISSION QUEUE ── */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontWeight:800, fontSize:18 }}>Submission Review Queue</div>
              <div style={{ display:"flex", gap:8 }}>
                {[
                  { key:"pending",  label:`Pending (${pending.length})`,   c:"#f59e0b" },
                  { key:"rejected", label:`Rejected (${rejected.length})`, c:"#ef4444" },
                ].map(b=>(
                  <button key={b.key} onClick={()=>setQueueFilter(b.key)} style={{
                    padding:"7px 15px", borderRadius:8, border:`1px solid ${queueFilter===b.key?b.c:"rgba(255,255,255,.1)"}`,
                    background: queueFilter===b.key?`rgba(${hexToRgb(b.c)},.1)`:"transparent",
                    color: queueFilter===b.key?b.c:"#64748b", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit",
                  }}>{b.label}</button>
                ))}
              </div>
            </div>

            {/* Queue */}
            {queueFilter==="pending" && (
              pending.length===0
                ? <Empty icon="🎉" msg="All caught up! No pending submissions."/>
                : (
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {pending.map((item)=>{
                      const sup=item.supplierId?suppliers.find(s=>s.id===item.supplierId):null;
                      const isSelected = selectedSub?.id===item.id;
                      return (
                        <div key={item.id} style={{ ...cardBase, border:isSelected?"1px solid rgba(245,158,11,.4)":"1px solid rgba(255,255,255,.07)", background:isSelected?"rgba(245,158,11,.04)":"rgba(255,255,255,.03)" }}>
                          {/* Row summary */}
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                            <div style={{ flex:1 }}>
                              <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                                <span style={{ fontWeight:700, fontSize:15 }}>{item.name}</span>
                                <span style={{ fontSize:11, fontWeight:600, color:"#0ea5e9", background:"rgba(14,165,233,.1)", padding:"2px 7px", borderRadius:5 }}>{item.category}</span>
                                <span style={{ fontSize:11, color:"#64748b" }}>📍 {item.state}</span>
                              </div>
                              <div style={{ display:"flex", gap:16, fontSize:13, color:"#94a3b8" }}>
                                <span style={{ fontWeight:800, color:"#f1f5f9", fontSize:16 }}>{fmtN(item.price)} <span style={{ fontSize:12, fontWeight:500, color:"#64748b" }}>/ {item.unit||"—"}</span></span>
                                {sup && <span>🏪 {sup.name}</span>}
                                {item.submittedBy && <span>👤 {item.submittedBy}</span>}
                                <span>🗓 {item.date}</span>
                              </div>
                              {item.note && <div style={{ marginTop:6, fontSize:12, color:"#64748b", fontStyle:"italic" }}>"{item.note}"</div>}
                            </div>
                            {/* Action buttons */}
                            <div style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
                              <Btn small onClick={()=>{ setEditSub({...item}); setSelectedSub(item); setShowRejectForm(false); }} outline color="#f59e0b">✏ Edit & Approve</Btn>
                              <Btn small onClick={()=>handleApprove(item)} color="#22c55e">✓ Approve</Btn>
                              <Btn small danger onClick={()=>{ setSelectedSub(item); setShowRejectForm(true); setEditSub(null); }}>✕ Reject</Btn>
                            </div>
                          </div>

                          {/* Reject form (inline expand) */}
                          {isSelected && showRejectForm && (
                            <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,.07)" }}>
                              <div style={{ fontSize:12, fontWeight:700, color:"#ef4444", marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>Rejection Details</div>
                              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                                <div>
                                  <label style={lbl}>Reason</label>
                                  <select value={rejectReason} onChange={e=>setRejectReason(e.target.value)} style={inp}>
                                    {REJECT_REASONS.map(r=><option key={r}>{r}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label style={lbl}>Admin Note (Optional)</label>
                                  <input value={rejectNote} onChange={e=>setRejectNote(e.target.value)} placeholder="Additional context…" style={inp}/>
                                </div>
                              </div>
                              <div style={{ display:"flex", gap:8, marginTop:12 }}>
                                <Btn small danger onClick={()=>handleReject(item)}>Confirm Rejection</Btn>
                                <Btn small outline color="#64748b" onClick={()=>{setShowRejectForm(false);setSelectedSub(null);}}>Cancel</Btn>
                              </div>
                            </div>
                          )}

                          {/* Edit form (inline expand) */}
                          {isSelected && editSub && !showRejectForm && (
                            <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,.07)" }}>
                              <div style={{ fontSize:12, fontWeight:700, color:"#f59e0b", marginBottom:10, textTransform:"uppercase", letterSpacing:.8 }}>Edit Before Publishing</div>
                              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
                                <div><label style={lbl}>Material Name</label><input value={editSub.name} onChange={e=>setEditSub(s=>({...s,name:e.target.value}))} style={inp}/></div>
                                <div><label style={lbl}>Price (₦)</label><input type="number" value={editSub.price} onChange={e=>setEditSub(s=>({...s,price:e.target.value}))} style={inp}/></div>
                                <div><label style={lbl}>Unit</label><input value={editSub.unit||""} onChange={e=>setEditSub(s=>({...s,unit:e.target.value}))} style={inp}/></div>
                                <div><label style={lbl}>Category</label>
                                  <select value={editSub.category} onChange={e=>setEditSub(s=>({...s,category:e.target.value}))} style={inp}>
                                    {CATEGORIES.slice(1).map(c=><option key={c}>{c}</option>)}
                                  </select>
                                </div>
                                <div><label style={lbl}>State</label>
                                  <select value={editSub.state} onChange={e=>setEditSub(s=>({...s,state:e.target.value}))} style={inp}>
                                    {STATES.slice(1).map(s=><option key={s}>{s}</option>)}
                                  </select>
                                </div>
                                <div><label style={lbl}>Trend</label>
                                  <select value={editSub.trend} onChange={e=>setEditSub(s=>({...s,trend:e.target.value}))} style={inp}>
                                    <option value="stable">Stable</option>
                                    <option value="up">Up</option>
                                    <option value="down">Down</option>
                                  </select>
                                </div>
                              </div>
                              <div style={{ display:"flex", gap:8 }}>
                                <Btn small color="#22c55e" onClick={handleApproveEdit}>✓ Publish Edited Version</Btn>
                                <Btn small outline color="#64748b" onClick={()=>{setEditSub(null);setSelectedSub(null);}}>Cancel</Btn>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
            )}

            {queueFilter==="rejected" && (
              rejected.length===0
                ? <Empty icon="📭" msg="No rejected submissions."/>
                : (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {rejected.map(item=>(
                      <div key={item.id} style={{ ...cardBase, opacity:.75 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div>
                            <div style={{ fontWeight:700, fontSize:15 }}>{item.name}</div>
                            <div style={{ fontSize:12, color:"#64748b", marginTop:3 }}>
                              {fmtN(item.price)} / {item.unit||"—"} · {item.state} · {item.date}
                            </div>
                            <div style={{ fontSize:12, color:"#ef4444", marginTop:4 }}>
                              ✕ {item.rejectedReason}
                              {item.rejectedNote && <span style={{ color:"#64748b" }}> — {item.rejectedNote}</span>}
                            </div>
                          </div>
                          <Pill label="Rejected" color="#ef4444"/>
                        </div>
                      </div>
                    ))}
                  </div>
                )
            )}

            {/* ── ADMIN TOOLS ROW ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:28, marginBottom:28 }}>

              {/* Supplier verification manager */}
              <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Supplier Verification</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:260, overflowY:"auto" }}>
                  {suppliers.map(sup=>(
                    <div key={sup.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 10px", background:"rgba(255,255,255,.03)", borderRadius:8 }}>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600 }}>{sup.name}</div>
                        <div style={{ fontSize:11, color:"#64748b" }}>📍 {sup.state} · ★ {sup.rating}</div>
                      </div>
                      <button
                        onClick={async ()=>{
                          await supabase.from("suppliers").update({ verified: !sup.verified }).eq("id", sup.id);
                          await loadData();
                          showToast(`${sup.name} ${!sup.verified?"verified":"unverified"}`);
                        }}
                        style={{ padding:"5px 12px", borderRadius:7, border:`1px solid ${sup.verified?"rgba(34,197,94,.3)":"rgba(148,163,184,.2)"}`, background:sup.verified?"rgba(34,197,94,.1)":"rgba(255,255,255,.04)", color:sup.verified?"#22c55e":"#64748b", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                        {sup.verified ? "✓ Verified" : "Unverified"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings panel */}
              <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20 }}>
                <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Admin Settings</div>

                {/* Index summary */}
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:"#94a3b8", marginBottom:8 }}>Index Overview</div>
                  {[
                    { label:"Total prices in index",   val:prices.length },
                    { label:"Verified prices",          val:prices.filter(p=>p.verified).length },
                    { label:"Unverified prices",        val:prices.filter(p=>!p.verified).length },
                    { label:"Total suppliers",          val:suppliers.length },
                    { label:"Verified suppliers",       val:suppliers.filter(s=>s.verified).length },
                    { label:"Total submissions processed", val:prices.length+rejected.length },
                  ].map((r,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,.04)", fontSize:12 }}>
                      <span style={{ color:"#64748b" }}>{r.label}</span>
                      <span style={{ color:"#f1f5f9", fontWeight:700 }}>{r.val}</span>
                    </div>
                  ))}
                </div>

                {/* Bulk verify all unverified */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <button
                    onClick={async ()=>{
                      await supabase.from("prices").update({ verified: true }).neq("id", 0);
                      await loadData();
                      showToast(`All prices marked as verified ✓`);
                    }}
                    style={{ padding:"9px 14px", borderRadius:8, border:"1px solid rgba(34,197,94,.25)", background:"rgba(34,197,94,.06)", color:"#22c55e", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                    ✓ Mark All Prices as Verified
                  </button>
                  <button
                    onClick={async ()=>{
                      if(window.confirm("Clear all rejected submissions? This cannot be undone.")) {
                        await supabase.from("rejected").delete().neq("id", 0);
                        await loadData();
                        showToast("Rejected queue cleared", "info");
                      }
                    }}
                    style={{ padding:"9px 14px", borderRadius:8, border:"1px solid rgba(239,68,68,.2)", background:"rgba(239,68,68,.05)", color:"#ef4444", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                    🗑 Clear All Rejected Submissions
                  </button>
                  <button
                    onClick={async ()=>{
                      if(window.confirm("Reset the entire database to seed data? All submitted prices will be lost.")) {
                        await supabase.from("prices").delete().neq("id", 0);
                        await supabase.from("suppliers").delete().neq("id", 0);
                        await supabase.from("pending").delete().neq("id", 0);
                        await supabase.from("rejected").delete().neq("id", 0);
                        const seedPrices = SEED_PRICES.map(({ id, supplierId, ...r }) => ({ ...r, supplier_id: supplierId }));
                        const seedSups   = SEED_SUPPLIERS.map(({ id, ...r }) => r);
                        await supabase.from("suppliers").insert(seedSups);
                        await supabase.from("prices").insert(seedPrices);
                        await loadData();
                        showToast("Database reset to seed data", "info");
                      }
                    }}
                    style={{ padding:"9px 14px", borderRadius:8, border:"1px solid rgba(148,163,184,.15)", background:"rgba(255,255,255,.03)", color:"#64748b", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                    ↺ Reset to Seed Data
                  </button>
                </div>
              </div>
            </div>

            {/* Live prices admin table */}
            <div style={{ marginTop:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <div>
                  <div style={{ fontWeight:800, fontSize:18, marginBottom:2 }}>Live Price Directory</div>
                  <div style={{ fontSize:12, color:"#475569" }}>Toggle verification status or remove individual prices.</div>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {prices.slice(0,30).map(item=>{
                  const sup=supOf(item);
                  return (
                    <div key={item.id} style={{ ...cardBase, padding:"11px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <span style={{ fontWeight:600, fontSize:14 }}>{item.name}</span>
                        <span style={{ fontSize:12, color:"#64748b", marginLeft:10 }}>{fmtN(item.price)} / {item.unit||"—"} · {item.state}</span>
                        {sup && <span style={{ fontSize:11, color:"#0ea5e9", marginLeft:8 }}>🏪 {sup.name}</span>}
                      </div>
                      <div style={{ display:"flex", gap:7, alignItems:"center", flexShrink:0 }}>
                        {/* Verify toggle */}
                        <button
                          onClick={async ()=>{
                            await supabase.from("prices").update({ verified: !item.verified }).eq("id", item.id);
                            await loadData();
                            showToast(`Price ${!item.verified?"verified":"unverified"}`, !item.verified?"success":"info");
                          }}
                          style={{ padding:"4px 10px", borderRadius:7, border:`1px solid ${item.verified?"rgba(14,165,233,.3)":"rgba(148,163,184,.2)"}`, background:item.verified?"rgba(14,165,233,.1)":"rgba(255,255,255,.04)", color:item.verified?"#0ea5e9":"#64748b", fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                          {item.verified?"✓ Verified":"Unverified"}
                        </button>
                        <Btn small danger outline onClick={()=>handleDeletePrice(item.id)}>Remove</Btn>
                      </div>
                    </div>
                  );
                })}
                {prices.length>30 && <div style={{ textAlign:"center", fontSize:12, color:"#475569", padding:10 }}>…and {prices.length-30} more listings</div>}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ══════════ PRICE MODAL ══════════ */}
      {pModal && (
        <Modal onClose={()=>setPModal(null)}>
          {(()=>{
            const item=pModal; const sup=supOf(item);
            return <>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                <span style={{ fontSize:11, fontWeight:600, color:"#0ea5e9", background:"rgba(14,165,233,.1)", padding:"4px 10px", borderRadius:6 }}>{item.category}</span>
                <button onClick={()=>setPModal(null)} style={{ background:"none",border:"none",color:"#64748b",fontSize:22,cursor:"pointer" }}>✕</button>
              </div>
              <h2 style={{ margin:"0 0 16px", fontWeight:800, fontSize:18, lineHeight:1.3 }}>{item.name}</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, marginBottom:16 }}>
                {[
                  { l:"Current Price", v:`${fmtN(item.price)} / ${item.unit}`, big:true },
                  { l:"Price Trend",   v:<TrendBadge trend={item.trend} change={item.change}/> },
                  { l:"State",         v:`📍 ${item.state}` },
                  { l:"Status",        v:<VerifiedBadge verified={item.verified}/> },
                  { l:"Updated",       v:item.date },
                  { l:"Supplier",      v:sup ? <button onClick={()=>{setPModal(null);setSModal(sup);}} style={{ background:"none",border:"none",padding:0,cursor:"pointer",color:"#0ea5e9",fontSize:13,fontFamily:"inherit",fontWeight:600,textDecoration:"underline" }}>{sup.name} →</button> : "—" },
                ].map((r,i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,.04)", borderRadius:9, padding:"10px 13px" }}>
                    <div style={{ fontSize:10, color:"#64748b", fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>{r.l}</div>
                    <div style={{ fontWeight:r.big?800:600, fontSize:r.big?16:13, color:r.big?"#0ea5e9":"#f1f5f9" }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:"#475569", textAlign:"center", paddingTop:11, borderTop:"1px solid rgba(255,255,255,.05)" }}>
                Crowd-sourced & verified. Confirm with supplier before procurement.
              </div>
            </>;
          })()}
        </Modal>
      )}

      {/* ══════════ SUPPLIER MODAL ══════════ */}
      {sModal && (
        <Modal onClose={()=>setSModal(null)} wide>
          {(()=>{
            const sup=sModal; const spP=prices.filter(p=>p.supplierId===sup.id);
            return <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
                <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:48,height:48,borderRadius:11,background:"linear-gradient(135deg,rgba(245,158,11,.25),rgba(14,165,233,.25))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22 }}>🏪</div>
                  <div>
                    <h2 style={{ margin:0, fontWeight:900, fontSize:18 }}>{sup.name}</h2>
                    <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>📍 {sup.state} · Est. {sup.since}</div>
                  </div>
                </div>
                <button onClick={()=>setSModal(null)} style={{ background:"none",border:"none",color:"#64748b",fontSize:22,cursor:"pointer" }}>✕</button>
              </div>
              <div style={{ display:"flex", gap:9, alignItems:"center", marginBottom:13 }}>
                <StarRating rating={sup.rating}/>
                <span style={{ fontSize:11, color:"#475569" }}>· {sup.reviews} reviews</span>
                <VerifiedBadge verified={sup.verified}/>
              </div>
              <p style={{ fontSize:14, color:"#94a3b8", lineHeight:1.6, margin:"0 0 14px" }}>{sup.description}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                {[{l:"Phone",v:`📞 ${sup.phone}`},{l:"Address",v:`📍 ${sup.address}`}].map((r,i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,.04)", borderRadius:9, padding:"10px 13px" }}>
                    <div style={{ fontSize:10, color:"#64748b", fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>{r.l}</div>
                    <div style={{ fontSize:13, color:"#f1f5f9", fontWeight:600 }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:10, color:"#64748b", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:7 }}>Specialisations</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{sup.categories.map(c=><Pill key={c} label={c}/>)}</div>
              </div>
              {spP.length>0 && (
                <div>
                  <div style={{ fontSize:10, color:"#64748b", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:9 }}>Listings ({spP.length})</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                    {spP.map(p=>(
                      <div key={p.id} onClick={()=>{setSModal(null);setPModal(p);}}
                        style={{ background:"rgba(255,255,255,.04)", borderRadius:9, padding:"9px 13px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", border:"1px solid transparent", transition:"all .15s" }}
                        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(14,165,233,.25)"}
                        onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600 }}>{p.name}</div>
                          <div style={{ fontSize:11, color:"#64748b" }}>{p.state} · {p.date}</div>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontWeight:800, color:"#0ea5e9", fontSize:14 }}>{fmtN(p.price)}</div>
                          <div style={{ fontSize:11, color:"#475569" }}>per {p.unit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>;
          })()}
        </Modal>
      )}

      {/* ══════════ PIN MODAL ══════════ */}
      {showPinModal && (
        <Modal onClose={()=>{setShowPinModal(false);setPinInput("");setPinError(false);}}>
          <div style={{ textAlign:"center", padding:"8px 0" }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔐</div>
            <h3 style={{ margin:"0 0 6px", fontWeight:800, fontSize:19 }}>Admin Access</h3>
            <p style={{ color:"#64748b", fontSize:13, marginBottom:22 }}>Enter your admin PIN to access the review queue.</p>
            <input
              type="password" value={pinInput}
              onChange={e=>{setPinInput(e.target.value); setPinError(false);}}
              onKeyDown={e=>e.key==="Enter"&&tryPin()}
              placeholder="Enter PIN"
              style={{ ...inp, textAlign:"center", fontSize:22, letterSpacing:8, maxWidth:200, margin:"0 auto 4px" }}
            />
            {pinError && <div style={{ color:"#ef4444", fontSize:12, marginBottom:10 }}>Incorrect PIN. Try again.</div>}
            <div style={{ fontSize:11, color:"#475569", marginBottom:18 }}>Demo PIN: <strong style={{ color:"#f59e0b" }}>1234</strong></div>
            <Btn onClick={tryPin}>Enter Admin Panel →</Btn>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type}/>}

      <footer style={{ borderTop:"1px solid rgba(255,255,255,.05)", padding:"18px 24px", textAlign:"center", marginTop:40 }}>
        <div style={{ fontSize:12, color:"#1e293b" }}>
          BuildPrice NG — Nigeria Construction Price Index · Powered by Joshua Imiavan · <span style={{ color:"#0ea5e9" }}>joshpat.com.ng</span>
        </div>
      </footer>
    </div>
  );
}

// ─── ESTIMATE CALCULATOR COMPONENT ───────────────────────────────────────────

function EstimateCalculator({ prices, suppliers, estState, setEstState, estProject, setEstProject, estItems, setEstItems, estContingency, setEstContingency, estVAT, setEstVAT, showEstResult, setShowEstResult }) {

  const fmtN = (n) => `₦${Number(n).toLocaleString("en-NG")}`;

  // Get prices filtered to the selected state, else fall back to all
  const stateOptions = [...new Set(prices.map(p=>p.state))].sort(); // eslint-disable-line no-unused-vars
  const pricesInState = prices.filter(p => p.state === estState);
  const fallbackPrices = prices; // used when no state match

  const getPriceOptions = () => {
    const inState = prices.filter(p => p.state === estState);
    return inState.length > 0 ? inState : fallbackPrices;
  };

  const priceOptions = getPriceOptions();

  // Line item helpers
  const addItem = () => setEstItems(items => [...items, { id:Date.now(), priceId:null, customName:"", qty:1, unit:"", unitPrice:0, note:"" }]);

  const removeItem = (id) => setEstItems(items => items.filter(i => i.id !== id));

  const updateItem = (id, field, value) => setEstItems(items => items.map(i => {
    if (i.id !== id) return i;
    const updated = { ...i, [field]: value };
    // Auto-fill unit price and unit when a price is selected
    if (field === "priceId" && value) {
      const p = prices.find(p => p.id === parseInt(value));
      if (p) {
        updated.unitPrice = p.price;
        updated.unit      = p.unit;
        updated.customName = p.name;
      }
    }
    return updated;
  }));

  // Totals
  const subtotal    = estItems.reduce((sum, i) => sum + (parseFloat(i.unitPrice)||0) * (parseFloat(i.qty)||0), 0);
  const contingency = subtotal * (parseFloat(estContingency)||0) / 100;
  const vatBase     = subtotal + contingency;
  const vat         = vatBase * (parseFloat(estVAT)||0) / 100;
  const grandTotal  = vatBase + vat;

  // Category breakdown
  const breakdown = {};
  estItems.forEach(item => {
    const p = item.priceId ? prices.find(pr => pr.id === parseInt(item.priceId)) : null;
    const cat = p?.category || "Uncategorised";
    const lineTotal = (parseFloat(item.unitPrice)||0) * (parseFloat(item.qty)||0);
    breakdown[cat] = (breakdown[cat]||0) + lineTotal;
  });
  const breakdownEntries = Object.entries(breakdown).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);

  const inp2 = { padding:"8px 11px", borderRadius:7, border:"1px solid rgba(255,255,255,.1)", background:"rgba(255,255,255,.05)", color:"#f1f5f9", fontSize:13, outline:"none", fontFamily:"inherit", width:"100%", boxSizing:"border-box" };
  const lbl2 = { fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:5, display:"block" };

  if (showEstResult) {
    return (
      <div style={{ maxWidth:780, margin:"0 auto" }}>
        {/* Result header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#22c55e", textTransform:"uppercase", marginBottom:4 }}>Estimate Complete</div>
            <h2 style={{ margin:0, fontWeight:900, fontSize:22 }}>{estProject || "Project Estimate"}</h2>
            <div style={{ fontSize:13, color:"#64748b", marginTop:3 }}>📍 {estState} · Generated {new Date().toLocaleDateString("en-NG", { day:"numeric", month:"long", year:"numeric" })}</div>
          </div>
          <button onClick={()=>setShowEstResult(false)} style={{ padding:"9px 18px", borderRadius:9, border:"1px solid rgba(255,255,255,.15)", background:"transparent", color:"#94a3b8", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>← Edit Estimate</button>
        </div>

        {/* Grand total hero */}
        <div style={{ background:"linear-gradient(135deg,rgba(14,165,233,.12),rgba(245,158,11,.08))", border:"1px solid rgba(14,165,233,.25)", borderRadius:16, padding:"28px 32px", marginBottom:24, textAlign:"center" }}>
          <div style={{ fontSize:12, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 }}>Total Project Material Cost</div>
          <div style={{ fontSize:"clamp(32px,6vw,52px)", fontWeight:900, color:"#f1f5f9", letterSpacing:-2, lineHeight:1 }}>{fmtN(Math.round(grandTotal))}</div>
          <div style={{ fontSize:13, color:"#64748b", marginTop:8 }}>Inclusive of {estContingency}% contingency & {estVAT}% VAT</div>
        </div>

        {/* Cost breakdown by category */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
          {/* Category pie-style bars */}
          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Cost by Category</div>
            {breakdownEntries.map(([cat,val],i)=>{
              const pct = subtotal > 0 ? (val/subtotal*100).toFixed(1) : 0;
              const colors = ["#0ea5e9","#f59e0b","#22c55e","#a855f7","#ef4444","#06b6d4","#f97316","#84cc16"];
              const c = colors[i % colors.length];
              return (
                <div key={cat} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ color:"#94a3b8", fontWeight:600 }}>{cat}</span>
                    <span style={{ color:"#f1f5f9", fontWeight:700 }}>{fmtN(Math.round(val))} <span style={{ color:"#64748b", fontWeight:500 }}>({pct}%)</span></span>
                  </div>
                  <div style={{ background:"rgba(255,255,255,.06)", borderRadius:4, height:6, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:c, borderRadius:4, transition:"width .6s" }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cost summary */}
          <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Cost Summary</div>
            {[
              { label:"Subtotal (Materials)",  value:subtotal,    color:"#f1f5f9" },
              { label:`Contingency (${estContingency}%)`, value:contingency, color:"#f59e0b" },
              { label:`VAT (${estVAT}%)`,       value:vat,         color:"#94a3b8" },
              { label:"Grand Total",            value:grandTotal,  color:"#0ea5e9", big:true },
            ].map((r,i)=>(
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom: i<3?"1px solid rgba(255,255,255,.05)":"none" }}>
                <span style={{ fontSize: r.big?14:13, color:"#94a3b8", fontWeight:r.big?700:500 }}>{r.label}</span>
                <span style={{ fontSize:r.big?18:14, fontWeight:r.big?900:700, color:r.color }}>{fmtN(Math.round(r.value))}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line items table */}
        <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20, marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Bill of Materials</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(255,255,255,.08)" }}>
                  {["#","Description","Qty","Unit","Unit Price","Line Total","State"].map(h=>(
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:10, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:.8, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {estItems.filter(i=>i.customName||i.unitPrice>0).map((item,idx)=>{
                  const lineTotal = (parseFloat(item.unitPrice)||0)*(parseFloat(item.qty)||0);
                  const p = item.priceId ? prices.find(pr=>pr.id===parseInt(item.priceId)) : null;
                  return (
                    <tr key={item.id} style={{ borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                      <td style={{ padding:"10px 10px", color:"#475569", fontWeight:700 }}>{idx+1}</td>
                      <td style={{ padding:"10px 10px" }}>
                        <div style={{ fontWeight:600, color:"#f1f5f9" }}>{item.customName||"—"}</div>
                        {item.note && <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{item.note}</div>}
                      </td>
                      <td style={{ padding:"10px 10px", color:"#94a3b8" }}>{item.qty}</td>
                      <td style={{ padding:"10px 10px", color:"#94a3b8" }}>{item.unit||"—"}</td>
                      <td style={{ padding:"10px 10px", color:"#94a3b8" }}>{fmtN(item.unitPrice)}</td>
                      <td style={{ padding:"10px 10px", fontWeight:700, color:"#0ea5e9" }}>{fmtN(Math.round(lineTotal))}</td>
                      <td style={{ padding:"10px 10px", fontSize:11, color:"#64748b" }}>{p?.state||estState}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop:"2px solid rgba(255,255,255,.1)" }}>
                  <td colSpan={5} style={{ padding:"12px 10px", fontWeight:700, color:"#94a3b8", fontSize:13 }}>Subtotal</td>
                  <td style={{ padding:"12px 10px", fontWeight:900, color:"#f1f5f9", fontSize:15 }}>{fmtN(Math.round(subtotal))}</td>
                  <td/>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background:"rgba(245,158,11,.06)", border:"1px solid rgba(245,158,11,.15)", borderRadius:10, padding:"12px 16px", fontSize:12, color:"#94a3b8", lineHeight:1.6 }}>
          ⚠️ <strong style={{ color:"#f59e0b" }}>Disclaimer:</strong> This estimate is based on current crowd-sourced market prices from BuildPrice NG and is for budgeting purposes only. Actual costs may vary. Always obtain formal quotations from verified suppliers before project commencement. Labour, plant hire, and professional fees are excluded.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:900, margin:"0 auto" }}>
      {/* Calculator header */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:"#a855f7", textTransform:"uppercase", marginBottom:6 }}>Live-Priced Estimator</div>
        <h2 style={{ margin:"0 0 6px", fontWeight:900, fontSize:22 }}>Project Material Cost Estimator</h2>
        <p style={{ color:"#475569", fontSize:14, margin:0 }}>Build your bill of materials. Prices auto-fill from the live index based on your state.</p>
      </div>

      {/* Project settings */}
      <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20, marginBottom:18 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1, marginBottom:14 }}>Project Settings</div>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:13 }}>
          <div>
            <label style={lbl2}>Project Name / Description</label>
            <input value={estProject} onChange={e=>setEstProject(e.target.value)} placeholder="e.g. 4-Bedroom Bungalow, Ado-Ekiti" style={inp2}/>
          </div>
          <div>
            <label style={lbl2}>Location (State)</label>
            <select value={estState} onChange={e=>setEstState(e.target.value)} style={inp2}>
              {STATES.slice(1).map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl2}>Contingency %</label>
            <input type="number" value={estContingency} onChange={e=>setEstContingency(e.target.value)} min={0} max={50} style={inp2}/>
          </div>
          <div>
            <label style={lbl2}>VAT %</label>
            <input type="number" value={estVAT} onChange={e=>setEstVAT(e.target.value)} min={0} max={20} style={inp2}/>
          </div>
        </div>
        {pricesInState.length === 0 && (
          <div style={{ marginTop:12, fontSize:12, color:"#f59e0b", background:"rgba(245,158,11,.08)", padding:"8px 12px", borderRadius:7 }}>
            ⚠ No prices found for {estState} yet. Prices from other states will be suggested — adjust manually.
          </div>
        )}
      </div>

      {/* Live totals bar */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:18 }}>
        {[
          { label:"Subtotal",        val:subtotal,    c:"#f1f5f9" },
          { label:`Contingency (${estContingency}%)`, val:contingency, c:"#f59e0b" },
          { label:`VAT (${estVAT}%)`, val:vat,        c:"#94a3b8" },
          { label:"Grand Total",     val:grandTotal,  c:"#0ea5e9", big:true },
        ].map((s,i)=>(
          <div key={i} style={{ background: i===3?"rgba(14,165,233,.08)":"rgba(255,255,255,.03)", border:`1px solid ${i===3?"rgba(14,165,233,.2)":"rgba(255,255,255,.07)"}`, borderRadius:11, padding:"13px 15px" }}>
            <div style={{ fontSize:10, color:"#64748b", fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:i===3?20:16, fontWeight:900, color:s.c, letterSpacing:-1, lineHeight:1 }}>{fmtN(Math.round(s.val))}</div>
          </div>
        ))}
      </div>

      {/* Line items */}
      <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:20, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:1 }}>Bill of Materials ({estItems.length} items)</div>
          <button onClick={addItem} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid rgba(14,165,233,.3)", background:"rgba(14,165,233,.08)", color:"#0ea5e9", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>+ Add Item</button>
        </div>

        {/* Column headers */}
        <div style={{ display:"grid", gridTemplateColumns:"3fr 1.2fr 1.2fr 1.5fr 1.8fr 36px", gap:8, marginBottom:8, padding:"0 4px" }}>
          {["Material / Description","Qty","Unit","Unit Price (₦)","Line Total",""].map(h=>(
            <div key={h} style={{ fontSize:10, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:.8 }}>{h}</div>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {estItems.map((item, idx) => {
            const lineTotal = (parseFloat(item.unitPrice)||0)*(parseFloat(item.qty)||0);
            return (
              <div key={item.id} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, padding:"12px 14px" }}>
                {/* Main row */}
                <div style={{ display:"grid", gridTemplateColumns:"3fr 1.2fr 1.2fr 1.5fr 1.8fr 36px", gap:8, alignItems:"center" }}>
                  {/* Material selector + name */}
                  <div>
                    <select
                      value={item.priceId||""}
                      onChange={e=>updateItem(item.id,"priceId",e.target.value)}
                      style={{ ...inp2, marginBottom:6, fontSize:12 }}
                    >
                      <option value="">— Select from price index —</option>
                      {priceOptions.map(p=>(
                        <option key={p.id} value={p.id}>{p.name} · {fmtN(p.price)}/{p.unit} · {p.state}</option>
                      ))}
                    </select>
                    <input
                      value={item.customName}
                      onChange={e=>updateItem(item.id,"customName",e.target.value)}
                      placeholder="Or type custom material name…"
                      style={{ ...inp2, fontSize:12 }}
                    />
                  </div>
                  <input type="number" value={item.qty} min={0} onChange={e=>updateItem(item.id,"qty",e.target.value)} style={{ ...inp2, textAlign:"center" }}/>
                  <input value={item.unit} onChange={e=>updateItem(item.id,"unit",e.target.value)} placeholder="bag…" style={inp2}/>
                  <input type="number" value={item.unitPrice} min={0} onChange={e=>updateItem(item.id,"unitPrice",e.target.value)} style={inp2}/>
                  <div style={{ fontWeight:800, fontSize:15, color: lineTotal>0?"#0ea5e9":"#475569" }}>{fmtN(Math.round(lineTotal))}</div>
                  <button onClick={()=>removeItem(item.id)} style={{ background:"rgba(239,68,68,.1)", border:"none", borderRadius:7, width:30, height:30, cursor:"pointer", color:"#ef4444", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
                </div>
                {/* Note row */}
                <div style={{ marginTop:8 }}>
                  <input value={item.note||""} onChange={e=>updateItem(item.id,"note",e.target.value)} placeholder="Optional note (e.g. foundation works, roof level…)" style={{ ...inp2, fontSize:11, color:"#64748b" }}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add item footer */}
        <button onClick={addItem} style={{ marginTop:14, width:"100%", padding:"11px", borderRadius:10, border:"1px dashed rgba(255,255,255,.12)", background:"transparent", color:"#475569", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}
          onMouseEnter={e=>{e.target.style.borderColor="rgba(14,165,233,.3)";e.target.style.color="#0ea5e9";}}
          onMouseLeave={e=>{e.target.style.borderColor="rgba(255,255,255,.12)";e.target.style.color="#475569";}}>
          + Add Another Material
        </button>
      </div>

      {/* Generate button */}
      <div style={{ display:"flex", justifyContent:"flex-end", gap:10 }}>
        <button onClick={()=>setEstItems([{ id:Date.now(), priceId:null, customName:"", qty:1, unit:"", unitPrice:0, note:"" }])}
          style={{ padding:"11px 20px", borderRadius:9, border:"1px solid rgba(255,255,255,.1)", background:"transparent", color:"#64748b", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
          Clear All
        </button>
        <button
          onClick={()=>{ if(subtotal>0) setShowEstResult(true); }}
          style={{ padding:"13px 28px", borderRadius:9, border:"none", cursor: subtotal>0?"pointer":"default", background: subtotal>0?"linear-gradient(135deg,#a855f7,#7c3aed)":"rgba(255,255,255,.06)", color: subtotal>0?"#fff":"#475569", fontWeight:800, fontSize:15, fontFamily:"inherit", transition:"all .2s" }}
          onMouseEnter={e=>{ if(subtotal>0) e.target.style.opacity=".88"; }}
          onMouseLeave={e=>e.target.style.opacity="1"}>
          Generate Estimate Report →
        </button>
      </div>
    </div>
  );
}

// ─── LAYOUT HELPERS ───────────────────────────────────────────────────────────

function FilterBar({ children, cols=4 }) {
  return (
    <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", borderRadius:14, padding:18, marginBottom:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:11, alignItems:"end" }}>
        {children}
      </div>
    </div>
  );
}

function FilterCol({ children, span=1 }) {
  return <div style={{ gridColumn:`span ${span}` }}>{children}</div>;
}

function Loader() {
  return <div style={{ textAlign:"center", padding:80, color:"#475569" }}>Loading…</div>;
}

function Empty({ icon, msg }) {
  return (
    <div style={{ textAlign:"center", padding:80, color:"#475569" }}>
      <div style={{ fontSize:36, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:14 }}>{msg}</div>
    </div>
  );
}
