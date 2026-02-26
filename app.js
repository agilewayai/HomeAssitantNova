"use strict";

const APP_RELEASE_VERSION = "2.3.0";
const STORAGE_SCHEMA_VERSION = 4;
const STORAGE_NAMESPACE = "homeassistant-nova";
const STORAGE_KEY = `${STORAGE_NAMESPACE}:state`;
const STORAGE_META_KEY = `${STORAGE_NAMESPACE}:meta`;
const STORAGE_BACKUP_INDEX_KEY = `${STORAGE_NAMESPACE}:backup-index`;
const STORAGE_BACKUP_PREFIX = `${STORAGE_NAMESPACE}:backup:`;
const LEGACY_STORAGE_KEYS = ["homeassistant-nova-v2"];
const MAX_STORAGE_BACKUPS = 8;
const UPGRADE_RELOAD_GUARD_KEY = `${STORAGE_NAMESPACE}:reloaded:${APP_RELEASE_VERSION}`;
const LOCALE_STORAGE_KEY = `${STORAGE_NAMESPACE}:locale`;
const SUPPORTED_LOCALES = ["zh", "en", "ja", "de", "fr", "es", "it"];
const DEFAULT_LOCALE = "zh";
const DAY_MS = 24 * 60 * 60 * 1000;

const ZONE_TYPE_LABEL = {
  zh: {
    vegetable: "蔬菜",
    protein: "蛋白",
    dairy: "乳制品",
    drinking: "饮品",
    leftover: "剩菜",
    frozen: "冷冻",
    snack: "零食",
    other: "其他",
  },
  en: {
    vegetable: "Vegetables",
    protein: "Protein",
    dairy: "Dairy",
    drinking: "Drinks",
    leftover: "Leftovers",
    frozen: "Frozen",
    snack: "Snacks",
    other: "Other",
  },
  ja: {
    vegetable: "野菜",
    protein: "たんぱく質",
    dairy: "乳製品",
    drinking: "飲料",
    leftover: "作り置き",
    frozen: "冷凍",
    snack: "軽食",
    other: "その他",
  },
  de: {
    vegetable: "Gemüse",
    protein: "Protein",
    dairy: "Molkerei",
    drinking: "Getränke",
    leftover: "Reste",
    frozen: "Tiefkühl",
    snack: "Snacks",
    other: "Andere",
  },
  fr: {
    vegetable: "Légumes",
    protein: "Protéines",
    dairy: "Produits laitiers",
    drinking: "Boissons",
    leftover: "Restes",
    frozen: "Surgelés",
    snack: "Snacks",
    other: "Autre",
  },
  es: {
    vegetable: "Verduras",
    protein: "Proteína",
    dairy: "Lácteos",
    drinking: "Bebidas",
    leftover: "Sobras",
    frozen: "Congelados",
    snack: "Snacks",
    other: "Otro",
  },
  it: {
    vegetable: "Verdure",
    protein: "Proteine",
    dairy: "Latticini",
    drinking: "Bevande",
    leftover: "Avanzi",
    frozen: "Surgelati",
    snack: "Snack",
    other: "Altro",
  },
};

const CATEGORY_LABEL = {
  zh: {
    vegetable: "蔬菜",
    fruit: "水果",
    protein: "蛋白",
    dairy: "乳制品",
    drink: "饮品",
    leftover: "剩菜",
    snack: "零食",
    other: "其他",
  },
  en: {
    vegetable: "Vegetables",
    fruit: "Fruit",
    protein: "Protein",
    dairy: "Dairy",
    drink: "Drinks",
    leftover: "Leftovers",
    snack: "Snacks",
    other: "Other",
  },
  ja: {
    vegetable: "野菜",
    fruit: "果物",
    protein: "たんぱく質",
    dairy: "乳製品",
    drink: "飲料",
    leftover: "作り置き",
    snack: "軽食",
    other: "その他",
  },
  de: {
    vegetable: "Gemüse",
    fruit: "Obst",
    protein: "Protein",
    dairy: "Molkerei",
    drink: "Getränke",
    leftover: "Reste",
    snack: "Snacks",
    other: "Andere",
  },
  fr: {
    vegetable: "Légumes",
    fruit: "Fruits",
    protein: "Protéines",
    dairy: "Produits laitiers",
    drink: "Boissons",
    leftover: "Restes",
    snack: "Snacks",
    other: "Autre",
  },
  es: {
    vegetable: "Verduras",
    fruit: "Frutas",
    protein: "Proteína",
    dairy: "Lácteos",
    drink: "Bebidas",
    leftover: "Sobras",
    snack: "Snacks",
    other: "Otro",
  },
  it: {
    vegetable: "Verdure",
    fruit: "Frutta",
    protein: "Proteine",
    dairy: "Latticini",
    drink: "Bevande",
    leftover: "Avanzi",
    snack: "Snack",
    other: "Altro",
  },
};

const STATUS_LABEL = {
  zh: {
    Auto: "自动判断",
    Fresh: "新鲜",
    Watch: "需关注",
    "Rescue Now": "优先处理",
    Critical: "今天处理",
    Expired: "已过期",
    Consumed: "已用完",
  },
  en: {
    Auto: "Auto",
    Fresh: "Fresh",
    Watch: "Watch",
    "Rescue Now": "Rescue Now",
    Critical: "Critical",
    Expired: "Expired",
    Consumed: "Consumed",
  },
  ja: {
    Auto: "自動判定",
    Fresh: "新鮮",
    Watch: "要注意",
    "Rescue Now": "優先消費",
    Critical: "本日優先",
    Expired: "期限切れ",
    Consumed: "消費済み",
  },
  de: {
    Auto: "Automatisch",
    Fresh: "Frisch",
    Watch: "Beobachten",
    "Rescue Now": "Jetzt verbrauchen",
    Critical: "Kritisch",
    Expired: "Abgelaufen",
    Consumed: "Verbraucht",
  },
  fr: {
    Auto: "Automatique",
    Fresh: "Frais",
    Watch: "À surveiller",
    "Rescue Now": "À traiter",
    Critical: "Critique",
    Expired: "Périmé",
    Consumed: "Consommé",
  },
  es: {
    Auto: "Automático",
    Fresh: "Fresco",
    Watch: "Vigilar",
    "Rescue Now": "Prioritario",
    Critical: "Crítico",
    Expired: "Caducado",
    Consumed: "Consumido",
  },
  it: {
    Auto: "Automatico",
    Fresh: "Fresco",
    Watch: "Da controllare",
    "Rescue Now": "Prioritario",
    Critical: "Critico",
    Expired: "Scaduto",
    Consumed: "Consumato",
  },
};

const FRIDGE_THEME_OPTIONS = [
  {
    id: "arctic",
    preview: "#9eb4c7",
    labels: { zh: "极地银", en: "Arctic", ja: "アークティック", de: "Arktis", fr: "Arctique", es: "Ártico", it: "Artico" },
  },
  {
    id: "mint",
    preview: "#71b49d",
    labels: { zh: "薄荷绿", en: "Mint", ja: "ミント", de: "Minze", fr: "Menthe", es: "Menta", it: "Menta" },
  },
  {
    id: "pearl",
    preview: "#d8dee8",
    labels: { zh: "珍珠白", en: "Pearl", ja: "パール", de: "Perlweiß", fr: "Perle", es: "Perla", it: "Perla" },
  },
  {
    id: "sunset",
    preview: "#d79f6d",
    labels: { zh: "暖杏橙", en: "Sunset", ja: "サンセット", de: "Sonnenuntergang", fr: "Coucher de soleil", es: "Atardecer", it: "Tramonto" },
  },
  {
    id: "rose",
    preview: "#c492a5",
    labels: { zh: "雾粉", en: "Rose", ja: "ローズ", de: "Rosa", fr: "Rose", es: "Rosa", it: "Rosa" },
  },
  {
    id: "graphite",
    preview: "#6f7f90",
    labels: { zh: "石墨灰", en: "Graphite", ja: "グラファイト", de: "Graphit", fr: "Graphite", es: "Grafito", it: "Grafite" },
  },
];

const DEFAULT_FRIDGE_THEME = "arctic";

const I18N = {
  zh: {
    app_title: "RAVIS-冰箱助手",
    app_subtitle: "图标化操作 + 弹出式编辑卡片，减少界面噪音，专注“先处理临期食材”。",
    locale_label: "语言",
    fleet_title: "我的冰箱",
    btn_add: "新增",
    btn_edit: "编辑",
    audit_title: "每日检查",
    audit_complete: "完成今日检查",
    risk_title: "保鲜概览",
    rescue_title: "近期优先食材",
    ideas_title: "用餐建议",
    quick_actions_title: "快捷操作",
    btn_create_zone: "新增分区",
    btn_edit_zone: "编辑分区",
    btn_add_item: "新增食材",
    btn_library: "食材库",
    btn_manual: "使用手册",
    btn_export_txt: "导出TXT清单",
    zone_items_title: "当前分区食材",
    ledger_title: "使用记录（近30天）",
    modal_create_fridge_title: "新增冰箱",
    modal_edit_fridge_title: "编辑当前冰箱",
    modal_create_zone_title: "新增分区",
    modal_edit_zone_title: "编辑当前分区",
    modal_library_title: "食材库管理",
    modal_manual_title: "使用手册 / Manual",
    modal_item_title: "食材编辑卡",
    toggle_close_door: "关闭冰箱门",
    toggle_open_door: "打开冰箱门",
    kpi_items: "食材",
    kpi_rescue: "临期",
    kpi_expired: "过期",
    kpi_wasted_30: "30天丢弃",
    empty_no_fridge: "暂无冰箱，请先创建。",
    empty_no_zone: "暂无分区。",
    empty_no_idea: "暂无建议。",
    empty_no_log: "暂无记录。",
    label_other: "其他",
    label_default: "默认",
    label_day: "天",
    manual_intro: "从“先处理临期”开始，用最少步骤管理冰箱。",
    export_title: "冰箱库存打印清单",
    export_generated_at: "导出时间",
    export_no_data: "暂无可导出的库存数据。",
    export_done: "TXT清单已导出。",
    export_fridge: "冰箱",
    export_zone: "分区",
    export_items: "食材数",
    export_empty_zone: "该分区暂无食材",
    locale_option_zh: "简体中文",
    locale_option_en: "English",
    locale_option_ja: "日本語",
    locale_option_de: "Deutsch",
    locale_option_fr: "Français",
    locale_option_es: "Español",
    locale_option_it: "Italiano",
  },
  en: {
    app_title: "RAVIS Fridge Assistant",
    app_subtitle: "Icon-first actions with popup cards. Keep the interface calm and prioritize near-expiry items.",
    locale_label: "Language",
    fleet_title: "My Fridges",
    btn_add: "Add",
    btn_edit: "Edit",
    audit_title: "Daily Check",
    audit_complete: "Complete Today's Check",
    risk_title: "Freshness Overview",
    rescue_title: "Priority Items",
    ideas_title: "Meal Ideas",
    quick_actions_title: "Quick Actions",
    btn_create_zone: "Add Zone",
    btn_edit_zone: "Edit Zone",
    btn_add_item: "Add Item",
    btn_library: "Library",
    btn_manual: "Manual",
    btn_export_txt: "Export TXT List",
    zone_items_title: "Items In Current Zone",
    ledger_title: "Usage Log (Last 30 Days)",
    modal_create_fridge_title: "Create Fridge",
    modal_edit_fridge_title: "Edit Fridge",
    modal_create_zone_title: "Create Zone",
    modal_edit_zone_title: "Edit Zone",
    modal_library_title: "Ingredient Library",
    modal_manual_title: "Manual / 使用手册",
    modal_item_title: "Item Card",
    toggle_close_door: "Close Door",
    toggle_open_door: "Open Door",
    kpi_items: "Items",
    kpi_rescue: "Rescue",
    kpi_expired: "Expired",
    kpi_wasted_30: "Wasted/30d",
    empty_no_fridge: "No fridges yet. Create one first.",
    empty_no_zone: "No zones yet.",
    empty_no_idea: "No suggestions yet.",
    empty_no_log: "No records yet.",
    label_other: "Other",
    label_default: "Default",
    label_day: "days",
    manual_intro: "Start with near-expiry first and manage fridge stock with minimal steps.",
    export_title: "Printable Fridge Inventory",
    export_generated_at: "Generated At",
    export_no_data: "No inventory data to export.",
    export_done: "TXT list exported.",
    export_fridge: "Fridge",
    export_zone: "Zone",
    export_items: "Items",
    export_empty_zone: "No items in this zone",
    locale_option_zh: "简体中文",
    locale_option_en: "English",
    locale_option_ja: "日本語",
    locale_option_de: "Deutsch",
    locale_option_fr: "Français",
    locale_option_es: "Español",
    locale_option_it: "Italiano",
  },
  ja: {
    app_title: "RAVIS 冷蔵庫アシスタント",
    app_subtitle: "アイコン中心の操作とポップアップ編集で、情報量を抑えつつ期限間近の食材を優先管理します。",
    locale_label: "言語",
    fleet_title: "冷蔵庫一覧",
    btn_add: "追加",
    btn_edit: "編集",
    audit_title: "デイリーチェック",
    audit_complete: "本日のチェック完了",
    risk_title: "鮮度ダッシュボード",
    rescue_title: "優先消費アイテム",
    ideas_title: "献立提案",
    quick_actions_title: "クイック操作",
    btn_create_zone: "区画追加",
    btn_edit_zone: "区画編集",
    btn_add_item: "食材追加",
    btn_library: "食材ライブラリ",
    btn_manual: "マニュアル",
    btn_export_txt: "TXT書き出し",
    zone_items_title: "選択中区画の食材",
    ledger_title: "利用履歴（直近30日）",
    modal_create_fridge_title: "冷蔵庫を作成",
    modal_edit_fridge_title: "冷蔵庫を編集",
    modal_create_zone_title: "区画を作成",
    modal_edit_zone_title: "区画を編集",
    modal_library_title: "食材ライブラリ管理",
    modal_manual_title: "マニュアル / 使用手册",
    modal_item_title: "食材カード",
    toggle_close_door: "ドアを閉める",
    toggle_open_door: "ドアを開ける",
    kpi_items: "食材",
    kpi_rescue: "優先",
    kpi_expired: "期限切れ",
    kpi_wasted_30: "30日廃棄",
    empty_no_fridge: "冷蔵庫がありません。先に作成してください。",
    empty_no_zone: "区画がありません。",
    empty_no_idea: "提案はまだありません。",
    empty_no_log: "記録はまだありません。",
    label_other: "その他",
    label_default: "標準",
    label_day: "日",
    manual_intro: "期限が近い食材から処理し、最小ステップで在庫管理しましょう。",
    export_title: "印刷用在庫リスト",
    export_generated_at: "出力日時",
    export_no_data: "出力できる在庫データがありません。",
    export_done: "TXTリストを出力しました。",
    export_fridge: "冷蔵庫",
    export_zone: "区画",
    export_items: "食材数",
    export_empty_zone: "この区画に食材はありません",
    locale_option_zh: "简体中文",
    locale_option_en: "English",
    locale_option_ja: "日本語",
    locale_option_de: "Deutsch",
    locale_option_fr: "Français",
    locale_option_es: "Español",
    locale_option_it: "Italiano",
  },
  de: {
    app_title: "RAVIS Kühlschrank-Assistent",
    app_subtitle: "Icon-zentrierte Bedienung mit Popup-Karten. Fokus auf Lebensmittel mit kurzer Restlaufzeit.",
    locale_label: "Sprache",
    fleet_title: "Meine Kühlschränke",
    btn_add: "Hinzufügen",
    btn_edit: "Bearbeiten",
    audit_title: "Täglicher Check",
    audit_complete: "Heutigen Check abschließen",
    risk_title: "Frische-Übersicht",
    rescue_title: "Priorisierte Lebensmittel",
    ideas_title: "Essensideen",
    quick_actions_title: "Schnellaktionen",
    btn_create_zone: "Bereich hinzufügen",
    btn_edit_zone: "Bereich bearbeiten",
    btn_add_item: "Lebensmittel hinzufügen",
    btn_library: "Bibliothek",
    btn_manual: "Handbuch",
    btn_export_txt: "TXT exportieren",
    zone_items_title: "Artikel im Bereich",
    ledger_title: "Verlauf (30 Tage)",
    modal_create_fridge_title: "Kühlschrank erstellen",
    modal_edit_fridge_title: "Kühlschrank bearbeiten",
    modal_create_zone_title: "Bereich erstellen",
    modal_edit_zone_title: "Bereich bearbeiten",
    modal_library_title: "Lebensmittelbibliothek",
    modal_manual_title: "Handbuch",
    modal_item_title: "Lebensmittelkarte",
    toggle_close_door: "Tür schließen",
    toggle_open_door: "Tür öffnen",
    kpi_items: "Artikel",
    kpi_rescue: "Priorität",
    kpi_expired: "Abgelaufen",
    kpi_wasted_30: "Entsorgt/30T",
    empty_no_fridge: "Noch kein Kühlschrank. Bitte zuerst erstellen.",
    empty_no_zone: "Noch keine Bereiche.",
    empty_no_idea: "Noch keine Vorschläge.",
    empty_no_log: "Noch keine Einträge.",
    label_other: "Andere",
    label_default: "Standard",
    label_day: "Tage",
    manual_intro: "Beginne mit bald ablaufenden Lebensmitteln und halte den Ablauf einfach.",
    export_title: "Druckbare Inventarliste",
    export_generated_at: "Erstellt am",
    export_no_data: "Keine Bestandsdaten zum Exportieren.",
    export_done: "TXT-Liste exportiert.",
    export_fridge: "Kühlschrank",
    export_zone: "Bereich",
    export_items: "Artikel",
    export_empty_zone: "Keine Artikel in diesem Bereich",
    locale_option_zh: "简体中文",
    locale_option_en: "English",
    locale_option_ja: "日本語",
    locale_option_de: "Deutsch",
    locale_option_fr: "Français",
    locale_option_es: "Español",
    locale_option_it: "Italiano",
  },
  fr: {
    app_title: "Assistant Frigo RAVIS",
    app_subtitle: "Actions par icônes et cartes popup. Priorisez les aliments proches de la date limite.",
    locale_label: "Langue",
    fleet_title: "Mes frigos",
    btn_add: "Ajouter",
    btn_edit: "Modifier",
    audit_title: "Contrôle quotidien",
    audit_complete: "Valider le contrôle du jour",
    risk_title: "Vue fraîcheur",
    rescue_title: "Aliments prioritaires",
    ideas_title: "Idées de repas",
    quick_actions_title: "Actions rapides",
    btn_create_zone: "Ajouter une zone",
    btn_edit_zone: "Modifier la zone",
    btn_add_item: "Ajouter un aliment",
    btn_library: "Bibliothèque",
    btn_manual: "Manuel",
    btn_export_txt: "Exporter TXT",
    zone_items_title: "Aliments de la zone",
    ledger_title: "Historique (30 jours)",
    modal_create_fridge_title: "Créer un frigo",
    modal_edit_fridge_title: "Modifier le frigo",
    modal_create_zone_title: "Créer une zone",
    modal_edit_zone_title: "Modifier la zone",
    modal_library_title: "Bibliothèque d'ingrédients",
    modal_manual_title: "Manuel",
    modal_item_title: "Fiche aliment",
    toggle_close_door: "Fermer la porte",
    toggle_open_door: "Ouvrir la porte",
    kpi_items: "Aliments",
    kpi_rescue: "Priorité",
    kpi_expired: "Périmés",
    kpi_wasted_30: "Jetés/30j",
    empty_no_fridge: "Aucun frigo pour l'instant.",
    empty_no_zone: "Aucune zone pour l'instant.",
    empty_no_idea: "Aucune suggestion pour l'instant.",
    empty_no_log: "Aucun enregistrement.",
    label_other: "Autre",
    label_default: "Par défaut",
    label_day: "jours",
    manual_intro: "Commencez par les aliments proches de la date limite avec un flux simple.",
    export_title: "Liste d'inventaire imprimable",
    export_generated_at: "Date d'export",
    export_no_data: "Aucune donnée à exporter.",
    export_done: "Liste TXT exportée.",
    export_fridge: "Frigo",
    export_zone: "Zone",
    export_items: "Articles",
    export_empty_zone: "Aucun aliment dans cette zone",
    locale_option_zh: "简体中文",
    locale_option_en: "English",
    locale_option_ja: "日本語",
    locale_option_de: "Deutsch",
    locale_option_fr: "Français",
    locale_option_es: "Español",
    locale_option_it: "Italiano",
  },
  es: {
    app_title: "Asistente de Nevera RAVIS",
    app_subtitle: "Acciones por iconos y edición en tarjetas emergentes. Prioriza alimentos próximos a vencer.",
    locale_label: "Idioma",
    fleet_title: "Mis neveras",
    btn_add: "Añadir",
    btn_edit: "Editar",
    audit_title: "Revisión diaria",
    audit_complete: "Completar revisión de hoy",
    risk_title: "Resumen de frescura",
    rescue_title: "Alimentos prioritarios",
    ideas_title: "Ideas de comida",
    quick_actions_title: "Acciones rápidas",
    btn_create_zone: "Añadir zona",
    btn_edit_zone: "Editar zona",
    btn_add_item: "Añadir alimento",
    btn_library: "Biblioteca",
    btn_manual: "Manual",
    btn_export_txt: "Exportar TXT",
    zone_items_title: "Alimentos de la zona",
    ledger_title: "Registro (30 días)",
    modal_create_fridge_title: "Crear nevera",
    modal_edit_fridge_title: "Editar nevera",
    modal_create_zone_title: "Crear zona",
    modal_edit_zone_title: "Editar zona",
    modal_library_title: "Biblioteca de ingredientes",
    modal_manual_title: "Manual",
    modal_item_title: "Ficha de alimento",
    toggle_close_door: "Cerrar puerta",
    toggle_open_door: "Abrir puerta",
    kpi_items: "Alimentos",
    kpi_rescue: "Prioridad",
    kpi_expired: "Caducados",
    kpi_wasted_30: "Desecho/30d",
    empty_no_fridge: "Aún no hay neveras.",
    empty_no_zone: "Aún no hay zonas.",
    empty_no_idea: "Aún no hay sugerencias.",
    empty_no_log: "Sin registros.",
    label_other: "Otro",
    label_default: "Predeterminado",
    label_day: "días",
    manual_intro: "Empieza por los alimentos que vencen antes y mantén el flujo simple.",
    export_title: "Lista imprimible de inventario",
    export_generated_at: "Fecha de exportación",
    export_no_data: "No hay datos para exportar.",
    export_done: "Lista TXT exportada.",
    export_fridge: "Nevera",
    export_zone: "Zona",
    export_items: "Alimentos",
    export_empty_zone: "No hay alimentos en esta zona",
    locale_option_zh: "简体中文",
    locale_option_en: "English",
    locale_option_ja: "日本語",
    locale_option_de: "Deutsch",
    locale_option_fr: "Français",
    locale_option_es: "Español",
    locale_option_it: "Italiano",
  },
  it: {
    app_title: "Assistente Frigo RAVIS",
    app_subtitle: "Azioni a icone con schede popup. Dai priorità ai cibi prossimi alla scadenza.",
    locale_label: "Lingua",
    fleet_title: "I miei frigoriferi",
    btn_add: "Aggiungi",
    btn_edit: "Modifica",
    audit_title: "Controllo giornaliero",
    audit_complete: "Completa controllo di oggi",
    risk_title: "Panoramica freschezza",
    rescue_title: "Alimenti prioritari",
    ideas_title: "Idee pasto",
    quick_actions_title: "Azioni rapide",
    btn_create_zone: "Aggiungi reparto",
    btn_edit_zone: "Modifica reparto",
    btn_add_item: "Aggiungi alimento",
    btn_library: "Libreria",
    btn_manual: "Manuale",
    btn_export_txt: "Esporta TXT",
    zone_items_title: "Alimenti nel reparto",
    ledger_title: "Registro (ultimi 30 giorni)",
    modal_create_fridge_title: "Crea frigorifero",
    modal_edit_fridge_title: "Modifica frigorifero",
    modal_create_zone_title: "Crea reparto",
    modal_edit_zone_title: "Modifica reparto",
    modal_library_title: "Libreria ingredienti",
    modal_manual_title: "Manuale",
    modal_item_title: "Scheda alimento",
    toggle_close_door: "Chiudi porta",
    toggle_open_door: "Apri porta",
    kpi_items: "Alimenti",
    kpi_rescue: "Priorità",
    kpi_expired: "Scaduti",
    kpi_wasted_30: "Sprecati/30g",
    empty_no_fridge: "Nessun frigorifero al momento.",
    empty_no_zone: "Nessun reparto al momento.",
    empty_no_idea: "Nessun suggerimento al momento.",
    empty_no_log: "Nessun record.",
    label_other: "Altro",
    label_default: "Predefinito",
    label_day: "giorni",
    manual_intro: "Parti dagli alimenti in scadenza e mantieni il flusso essenziale.",
    export_title: "Lista inventario stampabile",
    export_generated_at: "Data esportazione",
    export_no_data: "Nessun dato da esportare.",
    export_done: "Lista TXT esportata.",
    export_fridge: "Frigorifero",
    export_zone: "Reparto",
    export_items: "Alimenti",
    export_empty_zone: "Nessun alimento in questo reparto",
    locale_option_zh: "简体中文",
    locale_option_en: "English",
    locale_option_ja: "日本語",
    locale_option_de: "Deutsch",
    locale_option_fr: "Français",
    locale_option_es: "Español",
    locale_option_it: "Italiano",
  },
};

const MANUAL_CONTENT = {
  zh: {
    sections: [
      {
        title: "1. 快速开始",
        ordered: true,
        items: ["新建冰箱并确认默认分区。", "点“新增食材”或从“食材库”快速引用。", "每天查看“近期优先食材”，优先处理临期条目。"],
      },
      {
        title: "2. 核心操作",
        ordered: false,
        items: [
          "分区支持选中、编辑，且仅在清空后删除。",
          "食材可跨分区移动，状态可自动判断或手动覆盖。",
          "支持语音录入食材名、单位、备注。",
          "可切换冰箱颜色主题，便于多冰箱辨识。",
        ],
      },
      {
        title: "3. 数据安全",
        ordered: false,
        items: ["数据存储在本机浏览器 localStorage。", "版本升级前自动写入备份区并迁移。", "迁移异常时优先尝试最近备份恢复。"],
      },
    ],
    note: "提示：避免长期在隐私模式使用，清理浏览器存储会导致数据丢失。",
  },
  en: {
    sections: [
      {
        title: "1. Quick Start",
        ordered: true,
        items: [
          "Create a fridge and confirm default zones.",
          "Add items directly or apply from the ingredient library.",
          "Review priority items daily and consume near-expiry food first.",
        ],
      },
      {
        title: "2. Core Actions",
        ordered: false,
        items: [
          "Select and edit zones; deletion is allowed only when empty.",
          "Move items across zones and override status when needed.",
          "Voice input is available for name, unit, and notes.",
          "Switch fridge themes for quick visual recognition.",
        ],
      },
      {
        title: "3. Data Safety",
        ordered: false,
        items: [
          "All data is stored in browser localStorage.",
          "Before upgrades, a backup snapshot is created automatically.",
          "If migration fails, the app attempts recovery from recent backup.",
        ],
      },
    ],
    note: "Tip: avoid long-term use in private/incognito mode. Clearing browser storage removes data.",
  },
  ja: {
    sections: [
      {
        title: "1. クイックスタート",
        ordered: true,
        items: ["冷蔵庫を作成し、初期区画を確認します。", "食材を追加するか、ライブラリから引用します。", "毎日優先リストを確認し、期限が近い食材から消費します。"],
      },
      {
        title: "2. 主な操作",
        ordered: false,
        items: [
          "区画は選択・編集可能で、空の場合のみ削除できます。",
          "食材は区画間移動に対応し、状態は手動上書き可能です。",
          "食材名・単位・メモは音声入力に対応しています。",
          "冷蔵庫カラーを切り替えて視認性を高められます。",
        ],
      },
      {
        title: "3. データ保護",
        ordered: false,
        items: [
          "データはブラウザの localStorage に保存されます。",
          "アップグレード前に自動でバックアップ領域へ保存します。",
          "移行失敗時は最新バックアップから復元を試みます。",
        ],
      },
    ],
    note: "ヒント: プライベートモードの長期利用は避けてください。ブラウザ保存領域の削除でデータは失われます。",
  },
  de: {
    sections: [
      {
        title: "1. Schnellstart",
        ordered: true,
        items: [
          "Kühlschrank anlegen und Standardbereiche prüfen.",
          "Lebensmittel hinzufügen oder aus der Bibliothek übernehmen.",
          "Täglich Prioritäten prüfen und bald ablaufende Lebensmittel zuerst nutzen.",
        ],
      },
      {
        title: "2. Kernfunktionen",
        ordered: false,
        items: [
          "Bereiche auswählen und bearbeiten; Löschen nur im leeren Zustand.",
          "Lebensmittel zwischen Bereichen verschieben und Status manuell setzen.",
          "Spracheingabe für Name, Einheit und Notizen verfügbar.",
          "Farbschema des Kühlschranks für bessere Übersicht wechseln.",
        ],
      },
      {
        title: "3. Datensicherheit",
        ordered: false,
        items: [
          "Daten werden lokal in localStorage gespeichert.",
          "Vor jedem Versionswechsel wird ein Backup erstellt.",
          "Bei Fehlern versucht die App die Wiederherstellung aus dem Backup.",
        ],
      },
    ],
    note: "Hinweis: Im Inkognito-Modus nicht langfristig nutzen. Beim Löschen des Browser-Speichers gehen Daten verloren.",
  },
  fr: {
    sections: [
      {
        title: "1. Démarrage rapide",
        ordered: true,
        items: [
          "Créez un frigo et vérifiez les zones par défaut.",
          "Ajoutez des aliments ou appliquez un modèle depuis la bibliothèque.",
          "Consultez chaque jour la liste prioritaire et traitez les produits proches de la date.",
        ],
      },
      {
        title: "2. Actions clés",
        ordered: false,
        items: [
          "Sélection et modification des zones; suppression uniquement si vide.",
          "Déplacement d'aliments entre zones avec statut manuel possible.",
          "Saisie vocale pour nom, unité et note.",
          "Changement de couleur du frigo pour distinguer plusieurs appareils.",
        ],
      },
      {
        title: "3. Sécurité des données",
        ordered: false,
        items: [
          "Les données sont stockées localement dans localStorage.",
          "Une sauvegarde est créée avant migration de version.",
          "En cas d'erreur, l'application tente une restauration récente.",
        ],
      },
    ],
    note: "Conseil: évitez l'usage prolongé en navigation privée. La suppression du stockage navigateur efface les données.",
  },
  es: {
    sections: [
      {
        title: "1. Inicio rápido",
        ordered: true,
        items: [
          "Crea una nevera y revisa las zonas iniciales.",
          "Añade alimentos o aplica plantillas desde la biblioteca.",
          "Revisa la lista prioritaria cada día y consume primero lo próximo a vencer.",
        ],
      },
      {
        title: "2. Operaciones clave",
        ordered: false,
        items: [
          "Selecciona y edita zonas; solo se eliminan cuando están vacías.",
          "Mueve alimentos entre zonas y ajusta estado manualmente.",
          "Entrada por voz para nombre, unidad y notas.",
          "Cambia el color de la nevera para identificarla rápido.",
        ],
      },
      {
        title: "3. Seguridad de datos",
        ordered: false,
        items: [
          "Los datos se guardan localmente en localStorage.",
          "Antes de cada actualización se crea una copia de seguridad.",
          "Si la migración falla, la app intenta restaurar desde copia reciente.",
        ],
      },
    ],
    note: "Consejo: evita usar modo incógnito a largo plazo. Borrar almacenamiento del navegador elimina los datos.",
  },
  it: {
    sections: [
      {
        title: "1. Avvio rapido",
        ordered: true,
        items: [
          "Crea il frigorifero e verifica i reparti iniziali.",
          "Aggiungi alimenti o usa i modelli dalla libreria.",
          "Controlla ogni giorno la lista prioritaria e consuma prima le scadenze vicine.",
        ],
      },
      {
        title: "2. Funzioni principali",
        ordered: false,
        items: [
          "Seleziona e modifica reparti; eliminazione solo se vuoti.",
          "Sposta alimenti tra reparti e imposta lo stato manualmente.",
          "Input vocale per nome, unità e note.",
          "Cambia colore del frigorifero per riconoscerlo subito.",
        ],
      },
      {
        title: "3. Sicurezza dati",
        ordered: false,
        items: [
          "I dati sono salvati localmente in localStorage.",
          "Prima di ogni upgrade viene creato un backup automatico.",
          "In caso di errore la app tenta il ripristino dal backup recente.",
        ],
      },
    ],
    note: "Suggerimento: evita l'uso prolungato in modalità privata. La pulizia dello storage browser cancella i dati.",
  },
};

const DEFAULT_ZONE_TEMPLATES = [
  { name: "蔬菜抽屉", type: "vegetable", capacity: 20 },
  { name: "乳制品层", type: "dairy", capacity: 14 },
  { name: "剩菜层", type: "leftover", capacity: 10 },
  { name: "饮品层", type: "drinking", capacity: 16 },
  { name: "蛋白冷藏层", type: "protein", capacity: 12 },
];

const DEFAULT_ITEMS_BY_ZONE_TYPE = {
  vegetable: [
    { name: "菠菜", amount: 1, unit: "袋", category: "vegetable", daysValid: 2, note: "优先清炒" },
    { name: "西蓝花", amount: 1, unit: "颗", category: "vegetable", daysValid: 3, note: "可焯水备餐" },
  ],
  dairy: [
    { name: "鲜牛奶", amount: 2, unit: "瓶", category: "dairy", daysValid: 3, note: "早餐优先" },
    { name: "原味酸奶", amount: 3, unit: "杯", category: "dairy", daysValid: 5, note: "可搭配水果" },
  ],
  leftover: [
    { name: "昨晚熟食", amount: 1, unit: "盒", category: "leftover", daysValid: 1, note: "今天优先吃完" },
  ],
  drinking: [
    { name: "冷萃咖啡", amount: 1, unit: "瓶", category: "drink", daysValid: 2, note: "开封后尽快喝完" },
    { name: "气泡水", amount: 4, unit: "罐", category: "drink", daysValid: 10, note: "非紧急" },
  ],
  protein: [
    { name: "鸡胸肉", amount: 2, unit: "包", category: "protein", daysValid: 2, note: "可提前腌制" },
  ],
};

const DEFAULT_INGREDIENT_LIBRARY_TEMPLATES = [
  { name: "鸡蛋", aliases: ["蛋", "鸡子"], unit: "个", category: "protein", defaultDaysValid: 14, note: "早餐常备", locked: true },
  { name: "鲜牛奶", aliases: ["牛奶", "milk"], unit: "瓶", category: "dairy", defaultDaysValid: 4, note: "开封后优先喝完", locked: true },
  { name: "酸奶", aliases: ["yogurt"], unit: "杯", category: "dairy", defaultDaysValid: 6, note: "可搭配水果", locked: true },
  { name: "鸡胸肉", aliases: ["鸡肉"], unit: "包", category: "protein", defaultDaysValid: 2, note: "可提前分装", locked: true },
  { name: "猪里脊", aliases: ["里脊"], unit: "包", category: "protein", defaultDaysValid: 2, note: "建议冷冻备用", locked: true },
  { name: "生菜", aliases: ["lettuce"], unit: "颗", category: "vegetable", defaultDaysValid: 3, note: "优先凉拌", locked: true },
  { name: "菠菜", aliases: ["spinach"], unit: "袋", category: "vegetable", defaultDaysValid: 2, note: "易变质，尽快处理", locked: true },
  { name: "西蓝花", aliases: ["broccoli"], unit: "颗", category: "vegetable", defaultDaysValid: 4, note: "可焯水备餐", locked: true },
  { name: "番茄", aliases: ["西红柿", "tomato"], unit: "个", category: "vegetable", defaultDaysValid: 5, note: "沙拉/炒菜通用", locked: true },
  { name: "黄瓜", aliases: ["cucumber"], unit: "根", category: "vegetable", defaultDaysValid: 5, note: "可做凉拌", locked: true },
  { name: "苹果", aliases: ["apple"], unit: "个", category: "fruit", defaultDaysValid: 12, note: "常规水果", locked: true },
  { name: "香蕉", aliases: ["banana"], unit: "根", category: "fruit", defaultDaysValid: 4, note: "熟得快，注意临期", locked: true },
  { name: "蓝莓", aliases: ["blueberry"], unit: "盒", category: "fruit", defaultDaysValid: 4, note: "开盒后尽快吃", locked: true },
  { name: "豆腐", aliases: ["tofu"], unit: "盒", category: "protein", defaultDaysValid: 2, note: "可做汤或煎制", locked: true },
  { name: "冷萃咖啡", aliases: ["咖啡", "cold brew"], unit: "瓶", category: "drink", defaultDaysValid: 3, note: "开封后尽快饮用", locked: true },
  { name: "果汁", aliases: ["juice"], unit: "瓶", category: "drink", defaultDaysValid: 5, note: "开封后冷藏", locked: true },
  { name: "隔夜熟食", aliases: ["剩菜", "熟食"], unit: "盒", category: "leftover", defaultDaysValid: 1, note: "当天优先吃完", locked: true },
];

const MAX_RENDERED_RESCUE = 8;
const MAX_RENDERED_ZONE_ITEMS = 40;
const MAX_RENDERED_LEDGER = 20;
const MAX_INGREDIENT_LIBRARY = 240;
const MAX_LIBRARY_SUGGESTIONS = 8;
const MAX_LIBRARY_LIST = 120;

const ui = {
  doorOpen: true,
  toastTimer: null,
  speech: null,
  recordingButton: null,
  libraryQueryTimer: null,
  deferredSaveTimer: null,
  activeModalId: null,
  lastFocusedElement: null,
  startupNotice: "",
  needsUpgradeReload: false,
  locale: loadPreferredLocale(),
};

const els = {
  appTitle: document.getElementById("appTitle"),
  appSubtitle: document.getElementById("appSubtitle"),
  localeLabel: document.getElementById("localeLabel"),
  localeSwitcher: document.getElementById("localeSwitcher"),
  openCreateFridgeModalBtn: document.getElementById("openCreateFridgeModalBtn"),
  openEditFridgeModalBtn: document.getElementById("openEditFridgeModalBtn"),
  openCreateZoneModalBtn: document.getElementById("openCreateZoneModalBtn"),
  openEditZoneModalBtn: document.getElementById("openEditZoneModalBtn"),
  openAddItemModalBtn: document.getElementById("openAddItemModalBtn"),
  openLibraryModalBtn: document.getElementById("openLibraryModalBtn"),
  openManualModalBtn: document.getElementById("openManualModalBtn"),
  openExportTxtBtn: document.getElementById("openExportTxtBtn"),
  fleetTitle: document.getElementById("fleetTitle"),
  openCreateFridgeLabel: document.getElementById("openCreateFridgeLabel"),
  openEditFridgeLabel: document.getElementById("openEditFridgeLabel"),
  auditTitle: document.getElementById("auditTitle"),
  createFridgeForm: document.getElementById("createFridgeForm"),
  createFridgeName: document.getElementById("createFridgeName"),
  createFridgeLocation: document.getElementById("createFridgeLocation"),
  fridgeFleet: document.getElementById("fridgeFleet"),
  auditCard: document.getElementById("auditCard"),
  completeAuditBtn: document.getElementById("completeAuditBtn"),
  activeFridgeForm: document.getElementById("activeFridgeForm"),
  activeFridgeName: document.getElementById("activeFridgeName"),
  activeFridgeLocation: document.getElementById("activeFridgeLocation"),
  activeFridgeTheme: document.getElementById("activeFridgeTheme"),
  fridgeThemePicker: document.getElementById("fridgeThemePicker"),
  deleteFridgeBtn: document.getElementById("deleteFridgeBtn"),
  globalKpi: document.getElementById("globalKpi"),
  riskTitle: document.getElementById("riskTitle"),
  riskOverview: document.getElementById("riskOverview"),
  fridgeTitle: document.getElementById("fridgeTitle"),
  fridgeSubtitle: document.getElementById("fridgeSubtitle"),
  toggleDoorBtn: document.getElementById("toggleDoorBtn"),
  fridgeCabinet: document.getElementById("fridgeCabinet"),
  zoneGrid: document.getElementById("zoneGrid"),
  rescueTitle: document.getElementById("rescueTitle"),
  rescueList: document.getElementById("rescueList"),
  ideasTitle: document.getElementById("ideasTitle"),
  ideaList: document.getElementById("ideaList"),
  quickActionsTitle: document.getElementById("quickActionsTitle"),
  openCreateZoneLabel: document.getElementById("openCreateZoneLabel"),
  openEditZoneLabel: document.getElementById("openEditZoneLabel"),
  openAddItemLabel: document.getElementById("openAddItemLabel"),
  openLibraryLabel: document.getElementById("openLibraryLabel"),
  openManualLabel: document.getElementById("openManualLabel"),
  openExportTxtLabel: document.getElementById("openExportTxtLabel"),
  createZoneForm: document.getElementById("createZoneForm"),
  createZoneName: document.getElementById("createZoneName"),
  createZoneType: document.getElementById("createZoneType"),
  createZoneCapacity: document.getElementById("createZoneCapacity"),
  editZoneForm: document.getElementById("editZoneForm"),
  editZoneName: document.getElementById("editZoneName"),
  editZoneType: document.getElementById("editZoneType"),
  editZoneCapacity: document.getElementById("editZoneCapacity"),
  deleteZoneBtn: document.getElementById("deleteZoneBtn"),
  itemForm: document.getElementById("itemForm"),
  itemId: document.getElementById("itemId"),
  itemSourceZoneId: document.getElementById("itemSourceZoneId"),
  itemName: document.getElementById("itemName"),
  itemLibraryQuery: document.getElementById("itemLibraryQuery"),
  applyLibraryBtn: document.getElementById("applyLibraryBtn"),
  librarySuggestions: document.getElementById("librarySuggestions"),
  librarySuggestionChips: document.getElementById("librarySuggestionChips"),
  itemAmount: document.getElementById("itemAmount"),
  itemUnit: document.getElementById("itemUnit"),
  itemAddedDate: document.getElementById("itemAddedDate"),
  itemExpiryDate: document.getElementById("itemExpiryDate"),
  itemStatus: document.getElementById("itemStatus"),
  itemDaysLeft: document.getElementById("itemDaysLeft"),
  itemCategory: document.getElementById("itemCategory"),
  itemZoneId: document.getElementById("itemZoneId"),
  itemNote: document.getElementById("itemNote"),
  itemSubmitBtn: document.getElementById("itemSubmitBtn"),
  cancelEditItemBtn: document.getElementById("cancelEditItemBtn"),
  saveCurrentItemToLibraryBtn: document.getElementById("saveCurrentItemToLibraryBtn"),
  zoneItemsTitle: document.getElementById("zoneItemsTitle"),
  ledgerTitle: document.getElementById("ledgerTitle"),
  zoneItemsList: document.getElementById("zoneItemsList"),
  ledgerSummary: document.getElementById("ledgerSummary"),
  ledgerList: document.getElementById("ledgerList"),
  modalRoot: document.getElementById("modalRoot"),
  modalCreateFridge: document.getElementById("modalCreateFridge"),
  modalEditFridge: document.getElementById("modalEditFridge"),
  modalCreateZone: document.getElementById("modalCreateZone"),
  modalEditZone: document.getElementById("modalEditZone"),
  modalLibrary: document.getElementById("modalLibrary"),
  modalManual: document.getElementById("modalManual"),
  modalItem: document.getElementById("modalItem"),
  modalCreateFridgeTitle: document.getElementById("modalCreateFridgeTitle"),
  modalEditFridgeTitle: document.getElementById("modalEditFridgeTitle"),
  modalCreateZoneTitle: document.getElementById("modalCreateZoneTitle"),
  modalEditZoneTitle: document.getElementById("modalEditZoneTitle"),
  modalLibraryTitle: document.getElementById("modalLibraryTitle"),
  modalManualTitle: document.getElementById("modalManualTitle"),
  modalItemTitle: document.getElementById("modalItemTitle"),
  manualIntro: document.getElementById("manualIntro"),
  manualContent: document.getElementById("manualContent"),
  libraryForm: document.getElementById("libraryForm"),
  libraryItemId: document.getElementById("libraryItemId"),
  libraryName: document.getElementById("libraryName"),
  libraryUnit: document.getElementById("libraryUnit"),
  libraryCategory: document.getElementById("libraryCategory"),
  libraryDaysValid: document.getElementById("libraryDaysValid"),
  libraryAliases: document.getElementById("libraryAliases"),
  libraryNote: document.getElementById("libraryNote"),
  saveLibraryItemBtn: document.getElementById("saveLibraryItemBtn"),
  resetLibraryFormBtn: document.getElementById("resetLibraryFormBtn"),
  libraryCount: document.getElementById("libraryCount"),
  libraryList: document.getElementById("libraryList"),
  modalCloseTriggers: Array.from(document.querySelectorAll("[data-modal-close]")),
  toast: document.getElementById("toast"),
  voiceButtons: Array.from(document.querySelectorAll("[data-voice-target]")),
};

let state = loadState();

bindEvents();
setupSpeechRecognition();
applyLocaleToUI();
ensureSelectionIntegrity();
resetItemForm();
render();
runStartupSafetyFlow();

function bindEvents() {
  els.localeSwitcher.addEventListener("change", onLocaleChange);
  els.openCreateFridgeModalBtn.addEventListener("click", () => openModal("createFridge"));
  els.openEditFridgeModalBtn.addEventListener("click", () => openModal("editFridge"));
  els.openCreateZoneModalBtn.addEventListener("click", () => openModal("createZone"));
  els.openEditZoneModalBtn.addEventListener("click", () => openModal("editZone"));
  els.openAddItemModalBtn.addEventListener("click", () => openModal("item"));
  els.openLibraryModalBtn.addEventListener("click", () => openModal("library"));
  els.openManualModalBtn.addEventListener("click", () => openModal("manual"));
  els.openExportTxtBtn.addEventListener("click", onExportInventoryTxt);

  els.modalCloseTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", onGlobalKeydown);
  window.addEventListener("beforeunload", flushDeferredSaveState);

  els.createFridgeForm.addEventListener("submit", onCreateFridge);
  els.fridgeFleet.addEventListener("click", onSelectFridge);
  els.completeAuditBtn.addEventListener("click", onCompleteAudit);
  els.activeFridgeForm.addEventListener("submit", onSaveActiveFridge);
  els.fridgeThemePicker.addEventListener("click", onSelectFridgeTheme);
  els.deleteFridgeBtn.addEventListener("click", onDeleteFridge);
  els.toggleDoorBtn.addEventListener("click", onToggleDoor);

  els.createZoneForm.addEventListener("submit", onCreateZone);
  els.editZoneForm.addEventListener("submit", onSaveZone);
  els.deleteZoneBtn.addEventListener("click", onDeleteZone);

  els.zoneGrid.addEventListener("click", onSelectZone);
  els.rescueList.addEventListener("click", onActionFromList);
  els.zoneItemsList.addEventListener("click", onActionFromList);

  els.itemForm.addEventListener("submit", onSaveItem);
  els.cancelEditItemBtn.addEventListener("click", () => {
    resetItemForm(true);
    closeModal();
  });
  els.applyLibraryBtn.addEventListener("click", onApplyLibraryFromQuery);
  els.itemLibraryQuery.addEventListener("input", onLibraryQueryInput);
  els.librarySuggestionChips.addEventListener("click", onLibraryChipClick);
  els.saveCurrentItemToLibraryBtn.addEventListener("click", onSaveCurrentItemToLibrary);

  els.libraryForm.addEventListener("submit", onSaveLibraryItem);
  els.resetLibraryFormBtn.addEventListener("click", resetLibraryForm);
  els.libraryList.addEventListener("click", onLibraryListAction);

  ["input", "change"].forEach((evt) => {
    els.itemAmount.addEventListener(evt, refreshItemDerivedOutputs);
    els.itemExpiryDate.addEventListener(evt, refreshItemDerivedOutputs);
    els.itemAddedDate.addEventListener(evt, refreshItemDerivedOutputs);
  });

  els.voiceButtons.forEach((button) => {
    button.addEventListener("click", () => onToggleVoice(button));
  });
}

function onGlobalKeydown(event) {
  if (event.key === "Escape" && ui.activeModalId) {
    closeModal();
  }
}

function scheduleDeferredSaveState(delayMs = 180) {
  const delay = clamp(Math.round(toNumber(delayMs, 180)), 16, 2000);
  if (ui.deferredSaveTimer) {
    clearTimeout(ui.deferredSaveTimer);
  }
  ui.deferredSaveTimer = setTimeout(() => {
    ui.deferredSaveTimer = null;
    saveState();
  }, delay);
}

function flushDeferredSaveState() {
  if (!ui.deferredSaveTimer) return;
  clearTimeout(ui.deferredSaveTimer);
  ui.deferredSaveTimer = null;
  saveState();
}

function normalizeLocale(input) {
  const token = cleanText(input).toLowerCase();
  return SUPPORTED_LOCALES.includes(token) ? token : DEFAULT_LOCALE;
}

function loadPreferredLocale() {
  try {
    const saved = normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY));
    if (saved !== DEFAULT_LOCALE || cleanText(localStorage.getItem(LOCALE_STORAGE_KEY)) === DEFAULT_LOCALE) {
      return saved;
    }
  } catch (_err) {
    // Ignore locale read errors.
  }

  const nav = cleanText(navigator.language || navigator.userLanguage).toLowerCase();
  if (!nav) return DEFAULT_LOCALE;
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("de")) return "de";
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("it")) return "it";
  if (nav.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
}

function persistPreferredLocale(locale) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (_err) {
    // Ignore locale save errors.
  }
}

function getCurrentLocale() {
  return normalizeLocale(ui.locale);
}

function t(key, fallback = "") {
  const locale = getCurrentLocale();
  return I18N[locale]?.[key] || I18N.en?.[key] || I18N.zh?.[key] || fallback || key;
}

function localizedMapValue(map, key, fallback = "") {
  const locale = getCurrentLocale();
  return map[locale]?.[key] || map.en?.[key] || map.zh?.[key] || fallback;
}

function zoneTypeLabel(type) {
  return localizedMapValue(ZONE_TYPE_LABEL, type, t("label_other"));
}

function categoryLabel(category) {
  return localizedMapValue(CATEGORY_LABEL, category, t("label_other"));
}

function statusLabel(status) {
  return localizedMapValue(STATUS_LABEL, status, status);
}

function themeLabel(theme) {
  if (!theme) return "";
  return theme.labels?.[getCurrentLocale()] || theme.labels?.en || theme.labels?.zh || theme.id;
}

function onLocaleChange(event) {
  const nextLocale = normalizeLocale(event.target.value);
  if (nextLocale === ui.locale) return;
  ui.locale = nextLocale;
  persistPreferredLocale(nextLocale);
  applyLocaleToUI();
  render();
}

function applyLocaleToUI() {
  const locale = getCurrentLocale();
  document.documentElement.lang = locale === "zh" ? "zh-CN" : locale;
  document.title = t("app_title");

  els.localeSwitcher.value = locale;
  els.localeLabel.textContent = t("locale_label");

  els.appTitle.textContent = t("app_title");
  els.appSubtitle.textContent = t("app_subtitle");

  els.fleetTitle.textContent = t("fleet_title");
  els.openCreateFridgeLabel.textContent = t("btn_add");
  els.openEditFridgeLabel.textContent = t("btn_edit");
  els.auditTitle.textContent = t("audit_title");
  els.completeAuditBtn.textContent = t("audit_complete");
  els.riskTitle.textContent = t("risk_title");
  els.rescueTitle.textContent = t("rescue_title");
  els.ideasTitle.textContent = t("ideas_title");
  els.quickActionsTitle.textContent = t("quick_actions_title");
  els.openCreateZoneLabel.textContent = t("btn_create_zone");
  els.openEditZoneLabel.textContent = t("btn_edit_zone");
  els.openAddItemLabel.textContent = t("btn_add_item");
  els.openLibraryLabel.textContent = t("btn_library");
  els.openManualLabel.textContent = t("btn_manual");
  els.openExportTxtLabel.textContent = t("btn_export_txt");
  els.zoneItemsTitle.textContent = t("zone_items_title");
  els.ledgerTitle.textContent = t("ledger_title");

  els.modalCreateFridgeTitle.textContent = t("modal_create_fridge_title");
  els.modalEditFridgeTitle.textContent = t("modal_edit_fridge_title");
  els.modalCreateZoneTitle.textContent = t("modal_create_zone_title");
  els.modalEditZoneTitle.textContent = t("modal_edit_zone_title");
  els.modalLibraryTitle.textContent = t("modal_library_title");
  els.modalManualTitle.textContent = t("modal_manual_title");
  els.modalItemTitle.textContent = t("modal_item_title");
  els.manualIntro.textContent = t("manual_intro");

  const localeOptionMap = {
    zh: "locale_option_zh",
    en: "locale_option_en",
    ja: "locale_option_ja",
    de: "locale_option_de",
    fr: "locale_option_fr",
    es: "locale_option_es",
    it: "locale_option_it",
  };
  Array.from(els.localeSwitcher.options).forEach((option) => {
    option.textContent = t(localeOptionMap[option.value] || "locale_option_en");
  });

  localizeSelectOptions(els.createZoneType, ZONE_TYPE_LABEL);
  localizeSelectOptions(els.editZoneType, ZONE_TYPE_LABEL);
  localizeSelectOptions(els.itemCategory, CATEGORY_LABEL);
  localizeSelectOptions(els.libraryCategory, CATEGORY_LABEL);
  localizeSelectOptions(els.itemStatus, STATUS_LABEL);

  renderManualContent();
}

function localizeSelectOptions(selectEl, labelMap) {
  if (!(selectEl instanceof HTMLSelectElement)) return;
  Array.from(selectEl.options).forEach((option) => {
    const key = cleanText(option.value);
    option.textContent = localizedMapValue(labelMap, key, option.textContent);
  });
}

function renderManualContent() {
  if (!els.manualContent) return;
  const locale = getCurrentLocale();
  const content = MANUAL_CONTENT[locale] || MANUAL_CONTENT.en || MANUAL_CONTENT.zh;
  if (!content) {
    els.manualContent.innerHTML = "";
    return;
  }

  const html = content.sections
    .map((section) => {
      const tag = section.ordered ? "ol" : "ul";
      const items = section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      return `
        <article class="manual-card">
          <h4>${escapeHtml(section.title)}</h4>
          <${tag} class="manual-list">${items}</${tag}>
        </article>
      `;
    })
    .join("");

  const note = content.note ? `<p class="manual-note">${escapeHtml(content.note)}</p>` : "";
  els.manualContent.innerHTML = `${html}${note}`;
}

function runStartupSafetyFlow() {
  if (ui.startupNotice) {
    showToast(ui.startupNotice);
  }

  if (!ui.needsUpgradeReload) {
    return;
  }

  try {
    const hasReloaded = sessionStorage.getItem(UPGRADE_RELOAD_GUARD_KEY) === "1";
    if (!hasReloaded) {
      sessionStorage.setItem(UPGRADE_RELOAD_GUARD_KEY, "1");
      window.location.reload();
    }
  } catch (_err) {
    // Ignore session storage issues in restricted contexts.
  }
}

function openModal(modalId, options = {}) {
  const cards = {
    createFridge: els.modalCreateFridge,
    editFridge: els.modalEditFridge,
    createZone: els.modalCreateZone,
    editZone: els.modalEditZone,
    library: els.modalLibrary,
    manual: els.modalManual,
    item: els.modalItem,
  };

  const targetCard = cards[modalId];
  if (!targetCard) return;

  const fridge = getActiveFridge();
  const zone = getSelectedZone(fridge);
  if ((modalId === "editFridge" || modalId === "createZone" || modalId === "item") && !fridge) {
    showToast("请先创建或选择一个冰箱。");
    return;
  }
  if (modalId === "editZone" && !zone) {
    showToast("请先选择一个分区。");
    return;
  }
  if (modalId === "item" && (!fridge || !fridge.zones.length)) {
    showToast("请先创建至少一个分区。");
    return;
  }

  syncModalContext(modalId, options);
  ui.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  Object.values(cards).forEach((card) => {
    card.classList.add("hidden");
  });

  targetCard.classList.remove("hidden");
  els.modalRoot.classList.remove("hidden");
  els.modalRoot.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  ui.activeModalId = modalId;

  const firstField = targetCard.querySelector("input, select, textarea, button");
  if (firstField instanceof HTMLElement) {
    firstField.focus();
  }
}

function syncModalContext(modalId, options = {}) {
  if (modalId === "editFridge") {
    renderActiveFridgeSettings();
    return;
  }
  if (modalId === "editZone") {
    renderZoneEditor();
    return;
  }
  if (modalId === "item") {
    if (!options.preserveFormState) {
      resetItemForm(true);
    }
    renderItemZoneOptions();
    renderLibrarySuggestions(els.itemLibraryQuery.value);
    return;
  }
  if (modalId === "library") {
    resetLibraryForm();
    renderLibraryList();
    return;
  }
  if (modalId === "manual") {
    renderManualContent();
  }
}

function closeModal() {
  if (!ui.activeModalId) return;

  els.modalRoot.classList.add("hidden");
  els.modalRoot.setAttribute("aria-hidden", "true");
  els.modalCreateFridge.classList.add("hidden");
  els.modalEditFridge.classList.add("hidden");
  els.modalCreateZone.classList.add("hidden");
  els.modalEditZone.classList.add("hidden");
  els.modalLibrary.classList.add("hidden");
  els.modalManual.classList.add("hidden");
  els.modalItem.classList.add("hidden");
  document.body.classList.remove("modal-open");
  ui.activeModalId = null;

  if (ui.recordingButton) {
    try {
      ui.speech?.stop();
    } catch (_error) {
      // Ignore stop errors from browser speech engine.
    }
    stopVoiceUI();
  }

  if (ui.libraryQueryTimer) {
    clearTimeout(ui.libraryQueryTimer);
    ui.libraryQueryTimer = null;
  }

  if (ui.lastFocusedElement instanceof HTMLElement) {
    ui.lastFocusedElement.focus();
    ui.lastFocusedElement = null;
  }
}

function loadState() {
  const storageKeys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
  const uniqueKeys = Array.from(new Set(storageKeys));

  for (const key of uniqueKeys) {
    const entry = readStoredEntry(key);
    if (!entry) continue;

    const normalized = normalizeStatePayload(entry.payload);
    if (!normalized) continue;

    const schemaChanged = entry.schemaVersion !== STORAGE_SCHEMA_VERSION;
    const appChanged = cleanText(entry.appVersion) !== APP_RELEASE_VERSION;
    const movedFromLegacyKey = key !== STORAGE_KEY;

    if (schemaChanged || appChanged || movedFromLegacyKey || !entry.isEnvelope) {
      const backupKey = writeBackupSnapshot(entry.payload, {
        reason: "upgrade-transfer",
        fromSchemaVersion: entry.schemaVersion,
        fromAppVersion: entry.appVersion,
        sourceKey: key,
      });

      saveStateWithMeta(normalized, {
        reason: "upgrade-transfer",
        sourceKey: key,
        fromSchemaVersion: entry.schemaVersion,
        fromAppVersion: entry.appVersion,
        backupKey,
      });

      ui.startupNotice = "已完成版本升级迁移，并创建数据备份。";
      ui.needsUpgradeReload = true;
    } else {
      writeStorageMeta({
        currentSchemaVersion: STORAGE_SCHEMA_VERSION,
        currentAppVersion: APP_RELEASE_VERSION,
        lastSavedAt: entry.savedAt || new Date().toISOString(),
        lastLoadSource: key,
      });
      clearUpgradeReloadGuard();
    }

    return normalized;
  }

  const recovered = tryRestoreFromBackup();
  if (recovered) {
    return recovered;
  }

  const seeded = seedState();
  saveStateWithMeta(seeded, { reason: "seed" });
  clearUpgradeReloadGuard();
  return seeded;
}

function normalizeStatePayload(payload) {
  if (!payload || typeof payload !== "object") return null;

  const normalized = {
    fridges: Array.isArray(payload.fridges) ? payload.fridges.map(normalizeFridge).filter(Boolean) : [],
    activeFridgeId: payload.activeFridgeId || null,
    selectedZoneId: payload.selectedZoneId || null,
    logs: Array.isArray(payload.logs) ? payload.logs.map(normalizeLog).filter(Boolean) : [],
    ingredientLibrary: normalizeIngredientLibrary(payload.ingredientLibrary),
  };

  if (!normalized.fridges.length) return null;
  return normalized;
}

function readStoredEntry(key) {
  let raw = null;
  try {
    raw = localStorage.getItem(key);
  } catch (_err) {
    return null;
  }
  if (!raw) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch (_err) {
    return null;
  }

  const isEnvelope =
    parsed &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    parsed.payload &&
    typeof parsed.payload === "object";

  if (isEnvelope) {
    return {
      key,
      payload: parsed.payload,
      schemaVersion: clamp(Math.round(toNumber(parsed.__schemaVersion, 1)), 1, 999),
      appVersion: cleanText(parsed.__appVersion),
      savedAt: cleanText(parsed.savedAt) || null,
      isEnvelope: true,
    };
  }

  return {
    key,
    payload: parsed,
    schemaVersion: inferLegacySchemaVersion(key),
    appVersion: "",
    savedAt: null,
    isEnvelope: false,
  };
}

function inferLegacySchemaVersion(key) {
  if (key === "homeassistant-nova-v2") return 2;
  return 1;
}

function tryRestoreFromBackup() {
  const backups = readBackupIndex();
  for (const entry of backups) {
    if (!entry || !entry.key) continue;

    let raw = null;
    try {
      raw = localStorage.getItem(entry.key);
    } catch (_err) {
      continue;
    }
    if (!raw) continue;

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (_err) {
      continue;
    }

    const payload = parsed && typeof parsed === "object" ? parsed.payload : null;
    const normalized = normalizeStatePayload(payload);
    if (!normalized) continue;

    saveStateWithMeta(normalized, {
      reason: "backup-restore",
      sourceKey: entry.key,
      fromSchemaVersion: toNumber(parsed.fromSchemaVersion, 0),
      fromAppVersion: cleanText(parsed.fromAppVersion),
      backupKey: entry.key,
    });

    ui.startupNotice = "已从升级备份恢复数据并重新加载。";
    ui.needsUpgradeReload = true;
    return normalized;
  }

  return null;
}

function writeBackupSnapshot(payload, context = {}) {
  if (!payload || typeof payload !== "object") return "";

  const key = `${STORAGE_BACKUP_PREFIX}${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const backup = {
    createdAt,
    reason: cleanText(context.reason) || "upgrade-transfer",
    sourceKey: cleanText(context.sourceKey) || STORAGE_KEY,
    fromSchemaVersion: toNumber(context.fromSchemaVersion, 0),
    fromAppVersion: cleanText(context.fromAppVersion),
    payload,
  };

  const serialized = JSON.stringify(backup);
  if (!tryLocalStorageSetItem(key, serialized)) {
    pruneBackupStorage(Math.max(1, Math.floor(MAX_STORAGE_BACKUPS / 2)));
    if (!tryLocalStorageSetItem(key, serialized)) {
      return "";
    }
  }

  const index = readBackupIndex();
  const next = [{ key, createdAt, reason: backup.reason }, ...index.filter((item) => item && item.key !== key)];
  const trimmed = next.slice(0, MAX_STORAGE_BACKUPS);
  writeBackupIndex(trimmed);
  pruneBackupStorage(MAX_STORAGE_BACKUPS);
  return key;
}

function readBackupIndex() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_BACKUP_INDEX_KEY);
  } catch (_err) {
    return [];
  }
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && typeof entry === "object" && typeof entry.key === "string");
  } catch (_err) {
    return [];
  }
}

function writeBackupIndex(index) {
  const safeIndex = Array.isArray(index) ? index.slice(0, MAX_STORAGE_BACKUPS) : [];
  tryLocalStorageSetItem(STORAGE_BACKUP_INDEX_KEY, JSON.stringify(safeIndex));
}

function pruneBackupStorage(keepCount) {
  const safeKeep = clamp(Math.round(toNumber(keepCount, MAX_STORAGE_BACKUPS)), 0, 100);
  const index = readBackupIndex();
  const keep = index.slice(0, safeKeep);
  const remove = index.slice(safeKeep);

  for (const entry of remove) {
    if (!entry || !entry.key) continue;
    try {
      localStorage.removeItem(entry.key);
    } catch (_err) {
      // Ignore remove failures.
    }
  }

  writeBackupIndex(keep);
}

function readStorageMeta() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_META_KEY);
  } catch (_err) {
    return {};
  }
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_err) {
    return {};
  }
}

function writeStorageMeta(patch = {}) {
  const current = readStorageMeta();
  const next = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  tryLocalStorageSetItem(STORAGE_META_KEY, JSON.stringify(next));
}

function tryLocalStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (_err) {
    return false;
  }
}

function clearUpgradeReloadGuard() {
  try {
    sessionStorage.removeItem(UPGRADE_RELOAD_GUARD_KEY);
  } catch (_err) {
    // Ignore session storage issues in restricted contexts.
  }
}

function seedState() {
  const kitchen = createFridge("主厨房冰箱", "厨房", { withStarterItems: true });
  const office = createFridge("办公室小冰箱", "书房", { withStarterItems: true });

  kitchen.lastAuditDate = dayOffsetISO(-1);
  kitchen.auditStreak = 2;
  office.lastAuditDate = dayOffsetISO(-2);
  office.auditStreak = 1;

  const kitchenLeftover = kitchen.zones.find((zone) => zone.type === "leftover");
  if (kitchenLeftover?.items[0]) {
    kitchenLeftover.items[0].expiryDate = dayOffsetISO(0);
  }

  const kitchenDrink = kitchen.zones.find((zone) => zone.type === "drinking");
  if (kitchenDrink?.items[0]) {
    kitchenDrink.items[0].expiryDate = dayOffsetISO(-1);
  }

  return {
    fridges: [kitchen, office],
    activeFridgeId: kitchen.id,
    selectedZoneId: kitchen.zones[0]?.id || null,
    logs: [],
    ingredientLibrary: buildDefaultIngredientLibrary(),
  };
}

function normalizeFridgeTheme(value) {
  const token = cleanText(value);
  const exists = FRIDGE_THEME_OPTIONS.some((theme) => theme.id === token);
  return exists ? token : DEFAULT_FRIDGE_THEME;
}

function createFridge(name, location, options = {}) {
  const withStarterItems = options.withStarterItems !== false;
  const theme = normalizeFridgeTheme(options.theme);
  const now = new Date().toISOString();
  return {
    id: makeId(),
    name: cleanText(name) || "未命名冰箱",
    location: cleanText(location),
    theme,
    createdAt: now,
    updatedAt: now,
    lastAuditDate: null,
    auditStreak: 0,
    zones: createDefaultZones(withStarterItems),
  };
}

function createDefaultZones(withStarterItems = true) {
  return DEFAULT_ZONE_TEMPLATES.map((template) => {
    const zone = createZone(template.name, template.type, template.capacity);
    if (withStarterItems) {
      zone.items = buildStarterItemsForZone(template.type);
    }
    return zone;
  });
}

function buildStarterItemsForZone(zoneType) {
  const templates = DEFAULT_ITEMS_BY_ZONE_TYPE[zoneType] || [];
  return templates.map((template, index) =>
    createItem({
      name: template.name,
      amount: template.amount,
      unit: template.unit,
      addedDate: dayOffsetISO(-(index + 1)),
      expiryDate: dayOffsetISO(template.daysValid),
      status: "Auto",
      category: template.category,
      note: template.note,
    })
  );
}

function createZone(name, type, capacity) {
  const now = new Date().toISOString();
  return {
    id: makeId(),
    name: cleanText(name) || "新分区",
    type: ZONE_TYPE_LABEL.zh[type] ? type : "other",
    capacity: clamp(Math.round(toNumber(capacity, 18)), 1, 120),
    createdAt: now,
    updatedAt: now,
    items: [],
  };
}

function createItem(input) {
  const now = new Date().toISOString();
  const amount = toNumber(input.amount, 0);
  return {
    id: makeId(),
    name: cleanText(input.name) || "未命名食材",
    amount,
    unit: cleanText(input.unit) || "份",
    addedDate: normalizeDate(input.addedDate) || todayISO(),
    expiryDate: normalizeDate(input.expiryDate) || todayISO(),
    status: cleanText(input.status) || "Auto",
    category: CATEGORY_LABEL.zh[input.category] ? input.category : "other",
    note: cleanText(input.note),
    createdAt: now,
    updatedAt: now,
  };
}

function normalizeFridge(fridge) {
  if (!fridge || typeof fridge !== "object") return null;
  const zones = Array.isArray(fridge.zones) ? fridge.zones.map(normalizeZone).filter(Boolean) : [];
  return {
    id: fridge.id || makeId(),
    name: cleanText(fridge.name) || "未命名冰箱",
    location: cleanText(fridge.location),
    theme: normalizeFridgeTheme(fridge.theme),
    createdAt: fridge.createdAt || new Date().toISOString(),
    updatedAt: fridge.updatedAt || new Date().toISOString(),
    lastAuditDate: normalizeDate(fridge.lastAuditDate),
    auditStreak: clamp(Math.round(toNumber(fridge.auditStreak, 0)), 0, 9999),
    zones,
  };
}

function normalizeZone(zone) {
  if (!zone || typeof zone !== "object") return null;
  const items = Array.isArray(zone.items) ? zone.items.map(normalizeItem).filter(Boolean) : [];
  return {
    id: zone.id || makeId(),
    name: cleanText(zone.name) || "分区",
    type: ZONE_TYPE_LABEL.zh[zone.type] ? zone.type : "other",
    capacity: clamp(Math.round(toNumber(zone.capacity, 18)), 1, 120),
    createdAt: zone.createdAt || new Date().toISOString(),
    updatedAt: zone.updatedAt || new Date().toISOString(),
    items,
  };
}

function normalizeItem(item) {
  if (!item || typeof item !== "object") return null;
  const amount = toNumber(item.amount, 0);
  return {
    id: item.id || makeId(),
    name: cleanText(item.name) || "食材",
    amount,
    unit: cleanText(item.unit) || "份",
    addedDate: normalizeDate(item.addedDate) || todayISO(),
    expiryDate: normalizeDate(item.expiryDate) || todayISO(),
    status: cleanText(item.status) || "Auto",
    category: CATEGORY_LABEL.zh[item.category] ? item.category : "other",
    note: cleanText(item.note),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

function normalizeLog(log) {
  if (!log || typeof log !== "object") return null;
  const action = cleanText(log.action);
  if (!action) return null;
  return {
    id: log.id || makeId(),
    fridgeId: cleanText(log.fridgeId),
    fridgeName: cleanText(log.fridgeName),
    zoneName: cleanText(log.zoneName),
    itemName: cleanText(log.itemName),
    action,
    daysLeftAtAction: toNumber(log.daysLeftAtAction, 0),
    at: log.at || new Date().toISOString(),
  };
}

function buildDefaultIngredientLibrary() {
  return DEFAULT_INGREDIENT_LIBRARY_TEMPLATES.map((template) => ({
    id: makeId(),
    name: cleanText(template.name),
    aliases: normalizeAliases(template.aliases),
    unit: cleanText(template.unit) || "份",
    category: CATEGORY_LABEL.zh[template.category] ? template.category : "other",
    defaultDaysValid: clamp(Math.round(toNumber(template.defaultDaysValid, 5)), 1, 60),
    note: cleanText(template.note),
    locked: Boolean(template.locked),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

function normalizeIngredientLibrary(library) {
  const defaults = buildDefaultIngredientLibrary();
  const incoming = Array.isArray(library) ? library.map(normalizeIngredient).filter(Boolean) : [];

  if (!incoming.length) return defaults;

  const map = new Map();
  for (const entry of defaults) {
    map.set(searchToken(entry.name), entry);
  }
  for (const entry of incoming) {
    const key = searchToken(entry.name);
    if (!key) continue;
    map.set(key, {
      ...entry,
      locked: map.get(key)?.locked ? true : Boolean(entry.locked),
    });
  }
  return trimIngredientCollection(Array.from(map.values()));
}

function normalizeIngredient(item) {
  if (!item || typeof item !== "object") return null;
  const name = cleanText(item.name);
  if (!name) return null;
  return {
    id: item.id || makeId(),
    name,
    aliases: normalizeAliases(item.aliases),
    unit: cleanText(item.unit) || "份",
    category: CATEGORY_LABEL.zh[item.category] ? item.category : "other",
    defaultDaysValid: clamp(Math.round(toNumber(item.defaultDaysValid, 5)), 1, 60),
    note: cleanText(item.note),
    locked: Boolean(item.locked),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

function normalizeAliases(value) {
  const source = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[,，;；、/|]/g) : [];
  const aliases = [];
  const seen = new Set();

  for (const raw of source) {
    const alias = cleanText(raw);
    const token = searchToken(alias);
    if (!alias || !token || seen.has(token)) continue;
    seen.add(token);
    aliases.push(alias);
  }

  return aliases.slice(0, 12);
}

function searchToken(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]/g, "");
}

function sortIngredientLibrary(a, b) {
  if (a.locked !== b.locked) return a.locked ? -1 : 1;
  if (!a.locked && !b.locked) {
    const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    if (timeA !== timeB) return timeB - timeA;
  }
  return a.name.localeCompare(b.name, getCurrentLocale());
}

function trimIngredientCollection(collection) {
  const map = new Map();

  for (const raw of collection) {
    const item = normalizeIngredient(raw);
    if (!item) continue;

    const key = searchToken(item.name);
    if (!key) continue;

    const existing = map.get(key);
    if (!existing) {
      map.set(key, item);
      continue;
    }

    if (existing.locked && !item.locked) continue;
    if (!existing.locked && item.locked) {
      map.set(key, item);
      continue;
    }

    const existingTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
    const currentTime = new Date(item.updatedAt || item.createdAt || 0).getTime();
    if (currentTime >= existingTime) {
      map.set(key, {
        ...item,
        locked: existing.locked || item.locked,
      });
    }
  }

  const sorted = Array.from(map.values()).sort(sortIngredientLibrary);
  const locked = sorted.filter((item) => item.locked);
  const custom = sorted.filter((item) => !item.locked);

  if (locked.length >= MAX_INGREDIENT_LIBRARY) {
    return locked.slice(0, MAX_INGREDIENT_LIBRARY);
  }

  const maxCustom = Math.max(0, MAX_INGREDIENT_LIBRARY - locked.length);
  return [...locked, ...custom.slice(0, maxCustom)];
}

function trimIngredientLibrary() {
  state.ingredientLibrary = trimIngredientCollection(state.ingredientLibrary);
}

function saveState() {
  saveStateWithMeta(state, { reason: "save" });
}

function saveStateWithMeta(payload, context = {}) {
  const savedAt = new Date().toISOString();
  const envelope = {
    __schemaVersion: STORAGE_SCHEMA_VERSION,
    __appVersion: APP_RELEASE_VERSION,
    savedAt,
    payload,
  };

  const ok = tryLocalStorageSetItem(STORAGE_KEY, JSON.stringify(envelope));
  if (!ok) {
    showToast("本地存储空间不足，保存失败。请清理部分历史数据。");
    return false;
  }

  writeStorageMeta({
    currentSchemaVersion: STORAGE_SCHEMA_VERSION,
    currentAppVersion: APP_RELEASE_VERSION,
    lastSavedAt: savedAt,
    lastReason: cleanText(context.reason) || "save",
    lastLoadSource: cleanText(context.sourceKey) || STORAGE_KEY,
    lastMigrationFromSchema: toNumber(context.fromSchemaVersion, 0),
    lastMigrationFromApp: cleanText(context.fromAppVersion),
    lastBackupKey: cleanText(context.backupKey),
  });
  return true;
}

function persistAndRender() {
  saveState();
  render();
}

function ensureSelectionIntegrity() {
  if (!state.fridges.length) {
    const fallback = createFridge("主厨房冰箱", "厨房");
    state.fridges.push(fallback);
  }

  let active = getActiveFridge();
  if (!active) {
    state.activeFridgeId = state.fridges[0].id;
    active = getActiveFridge();
  }

  if (!active) {
    state.selectedZoneId = null;
    return;
  }

  if (!active.zones.length) {
    active.zones = createDefaultZones().slice(0, 1);
  }

  const selectedExists = active.zones.some((zone) => zone.id === state.selectedZoneId);
  if (!selectedExists) {
    state.selectedZoneId = active.zones[0]?.id || null;
  }
}

function getActiveFridge() {
  return state.fridges.find((fridge) => fridge.id === state.activeFridgeId) || null;
}

function getSelectedZone(fridge) {
  if (!fridge) return null;
  return fridge.zones.find((zone) => zone.id === state.selectedZoneId) || null;
}

function onCreateFridge(event) {
  event.preventDefault();
  const name = cleanText(els.createFridgeName.value);
  if (!name) {
    showToast("冰箱名称不能为空。");
    return;
  }
  const location = cleanText(els.createFridgeLocation.value);
  const fridge = createFridge(name, location);
  state.fridges.unshift(fridge);
  state.activeFridgeId = fridge.id;
  state.selectedZoneId = fridge.zones[0]?.id || null;
  els.createFridgeForm.reset();
  resetItemForm();
  persistAndRender();
  closeModal();
  showToast("已创建新冰箱。");
}

function onSelectFridge(event) {
  const button = event.target.closest("[data-fridge-id]");
  if (!button) return;
  const fridgeId = button.getAttribute("data-fridge-id");
  if (!fridgeId || fridgeId === state.activeFridgeId) return;
  state.activeFridgeId = fridgeId;
  ensureSelectionIntegrity();
  resetItemForm();
  persistAndRender();
}

function onSaveActiveFridge(event) {
  event.preventDefault();
  const fridge = getActiveFridge();
  if (!fridge) return;

  const name = cleanText(els.activeFridgeName.value);
  if (!name) {
    showToast("当前冰箱名称不能为空。");
    return;
  }

  fridge.name = name;
  fridge.location = cleanText(els.activeFridgeLocation.value);
  fridge.theme = normalizeFridgeTheme(els.activeFridgeTheme.value);
  fridge.updatedAt = new Date().toISOString();
  persistAndRender();
  closeModal();
  showToast("冰箱设置已保存。");
}

function onSelectFridgeTheme(event) {
  const button = event.target.closest("[data-theme-id]");
  if (!button) return;
  const themeId = normalizeFridgeTheme(button.getAttribute("data-theme-id"));
  els.activeFridgeTheme.value = themeId;
  renderFridgeThemePicker(themeId);
}

function onDeleteFridge() {
  const fridge = getActiveFridge();
  if (!fridge) return;

  if (countItemsInFridge(fridge) > 0) {
    showToast("删除失败：请先清空该冰箱所有食材。");
    return;
  }

  const ok = window.confirm(`确认删除冰箱「${fridge.name}」？`);
  if (!ok) return;

  state.fridges = state.fridges.filter((entry) => entry.id !== fridge.id);
  if (!state.fridges.length) {
    state.fridges.push(createFridge("主厨房冰箱", "厨房"));
  }
  state.activeFridgeId = state.fridges[0].id;
  state.selectedZoneId = state.fridges[0].zones[0]?.id || null;
  resetItemForm();
  persistAndRender();
  closeModal();
  showToast("冰箱已删除。");
}

function onCompleteAudit() {
  const fridge = getActiveFridge();
  if (!fridge) return;

  const today = todayISO();
  if (fridge.lastAuditDate === today) {
    showToast("今天已完成检查。");
    return;
  }

  const last = normalizeDate(fridge.lastAuditDate);
  if (!last) {
    fridge.auditStreak = 1;
  } else {
    const gap = daysBetween(last, today);
    fridge.auditStreak = gap === 1 ? fridge.auditStreak + 1 : 1;
  }

  fridge.lastAuditDate = today;
  fridge.updatedAt = new Date().toISOString();
  persistAndRender();
  showToast("已记录今日检查。");
}

function onToggleDoor() {
  ui.doorOpen = !ui.doorOpen;
  renderDoorState();
}

function onCreateZone(event) {
  event.preventDefault();
  const fridge = getActiveFridge();
  if (!fridge) return;

  const name = cleanText(els.createZoneName.value);
  if (!name) {
    showToast("分区名称不能为空。");
    return;
  }

  const type = ZONE_TYPE_LABEL.zh[els.createZoneType.value] ? els.createZoneType.value : "other";
  const capacity = clamp(Math.round(toNumber(els.createZoneCapacity.value, 18)), 1, 120);
  const zone = createZone(name, type, capacity);
  fridge.zones.push(zone);
  fridge.updatedAt = new Date().toISOString();
  state.selectedZoneId = zone.id;

  els.createZoneForm.reset();
  els.createZoneCapacity.value = "18";
  resetItemForm();
  persistAndRender();
  closeModal();
  showToast("新分区已创建。");
}

function onSaveZone(event) {
  event.preventDefault();
  const fridge = getActiveFridge();
  const zone = getSelectedZone(fridge);
  if (!fridge || !zone) return;

  const name = cleanText(els.editZoneName.value);
  if (!name) {
    showToast("分区名称不能为空。");
    return;
  }

  zone.name = name;
  zone.type = ZONE_TYPE_LABEL.zh[els.editZoneType.value] ? els.editZoneType.value : "other";
  zone.capacity = clamp(Math.round(toNumber(els.editZoneCapacity.value, zone.capacity)), 1, 120);
  zone.updatedAt = new Date().toISOString();
  fridge.updatedAt = new Date().toISOString();
  persistAndRender();
  closeModal();
  showToast("分区已更新。");
}

function onDeleteZone() {
  const fridge = getActiveFridge();
  const zone = getSelectedZone(fridge);
  if (!fridge || !zone) return;

  if (zone.items.length > 0) {
    showToast("删除失败：请先清空该分区食材。");
    return;
  }

  if (fridge.zones.length <= 1) {
    showToast("至少保留一个分区。");
    return;
  }

  const ok = window.confirm(`确认删除分区「${zone.name}」？`);
  if (!ok) return;

  fridge.zones = fridge.zones.filter((entry) => entry.id !== zone.id);
  fridge.updatedAt = new Date().toISOString();
  state.selectedZoneId = fridge.zones[0]?.id || null;
  resetItemForm();
  persistAndRender();
  closeModal();
  showToast("分区已删除。");
}

function onSelectZone(event) {
  const button = event.target.closest("[data-zone-id]");
  if (!button) return;
  const zoneId = button.getAttribute("data-zone-id");
  if (!zoneId || zoneId === state.selectedZoneId) return;

  state.selectedZoneId = zoneId;
  scheduleDeferredSaveState();
  render();
}

function onSaveItem(event) {
  event.preventDefault();
  const fridge = getActiveFridge();
  if (!fridge) return;

  if (!fridge.zones.length) {
    showToast("请先创建至少一个分区。");
    return;
  }

  const name = cleanText(els.itemName.value);
  const amount = toNumber(els.itemAmount.value, NaN);
  const unit = cleanText(els.itemUnit.value);
  const addedDate = normalizeDate(els.itemAddedDate.value);
  const expiryDate = normalizeDate(els.itemExpiryDate.value);
  const status = cleanText(els.itemStatus.value) || "Auto";
  const category = CATEGORY_LABEL.zh[els.itemCategory.value] ? els.itemCategory.value : "other";
  const note = cleanText(els.itemNote.value);
  const targetZoneId = cleanText(els.itemZoneId.value);

  if (!name || Number.isNaN(amount) || amount < 0 || !unit || !addedDate || !expiryDate || !targetZoneId) {
    showToast("请完整填写食材信息。");
    return;
  }

  const targetZone = fridge.zones.find((zone) => zone.id === targetZoneId);
  if (!targetZone) {
    showToast("目标分区不存在。");
    return;
  }

  const now = new Date().toISOString();
  const payload = {
    name,
    amount,
    unit,
    addedDate,
    expiryDate,
    status,
    category,
    note,
  };

  const itemId = cleanText(els.itemId.value);
  const sourceZoneId = cleanText(els.itemSourceZoneId.value);

  if (itemId && sourceZoneId) {
    const sourceZone = fridge.zones.find((zone) => zone.id === sourceZoneId);
    if (!sourceZone) {
      showToast("原始分区不存在，请重新编辑。");
      return;
    }

    const oldIndex = sourceZone.items.findIndex((item) => item.id === itemId);
    if (oldIndex < 0) {
      showToast("该食材已不存在。");
      return;
    }

    const old = sourceZone.items[oldIndex];
    sourceZone.items.splice(oldIndex, 1);
    const updated = {
      ...old,
      ...payload,
      updatedAt: now,
    };

    targetZone.items.push(updated);
    sourceZone.updatedAt = now;
    targetZone.updatedAt = now;
    fridge.updatedAt = now;
    state.selectedZoneId = targetZone.id;

    resetItemForm();
    persistAndRender();
    closeModal();
    showToast("食材已更新。");
    return;
  }

  const item = createItem(payload);
  targetZone.items.push(item);
  targetZone.updatedAt = now;
  fridge.updatedAt = now;
  state.selectedZoneId = targetZone.id;

  resetItemForm();
  persistAndRender();
  closeModal();
  showToast("食材已添加。");
}

function onLibraryQueryInput() {
  if (ui.libraryQueryTimer) {
    clearTimeout(ui.libraryQueryTimer);
  }
  ui.libraryQueryTimer = setTimeout(() => {
    ui.libraryQueryTimer = null;
    renderLibrarySuggestions(els.itemLibraryQuery.value);
  }, 90);
}

function onApplyLibraryFromQuery() {
  const query = cleanText(els.itemLibraryQuery.value);
  const target = findBestLibraryMatch(query);
  if (!target) {
    showToast("未找到匹配食材，请尝试更短关键词。");
    return;
  }
  applyLibraryTemplate(target);
}

function onExportInventoryTxt() {
  const content = buildPrintableInventoryText();
  if (!content) {
    showToast(t("export_no_data"));
    return;
  }

  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    "-",
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
  ].join("");
  const fileName = `ravis-inventory-${stamp}.txt`;

  downloadTextFile(fileName, content);
  showToast(t("export_done"));
}

function buildPrintableInventoryText() {
  if (!Array.isArray(state.fridges) || !state.fridges.length) return "";

  const locale = getCurrentLocale();
  const nowText = new Date().toLocaleString(locale);
  const lines = [];
  const divider = "=".repeat(84);
  const subDivider = "-".repeat(68);

  lines.push(`${t("app_title")} | ${t("export_title")}`);
  lines.push(`${t("export_generated_at")}: ${nowText}`);
  lines.push(`Locale: ${locale}`);
  lines.push(divider);

  state.fridges.forEach((fridge, index) => {
    const zoneCount = Array.isArray(fridge.zones) ? fridge.zones.length : 0;
    const totalItems = countItemsInFridge(fridge);

    lines.push(`[${index + 1}] ${t("export_fridge")}: ${fridge.name}${fridge.location ? ` (${fridge.location})` : ""}`);
    lines.push(`    ${t("export_zone")}: ${zoneCount} | ${t("export_items")}: ${totalItems}`);
    lines.push(`    ${subDivider}`);

    if (!zoneCount) {
      lines.push(`    - ${t("empty_no_zone")}`);
      lines.push("");
      return;
    }

    fridge.zones.forEach((zone, zoneIndex) => {
      const zoneItems = Array.isArray(zone.items) ? zone.items.slice() : [];
      lines.push(`    (${zoneIndex + 1}) ${t("export_zone")}: ${zone.name} [${zoneTypeLabel(zone.type)}]`);
      lines.push(`        ${t("export_items")}: ${zoneItems.length} / ${zone.capacity}`);

      if (!zoneItems.length) {
        lines.push(`        - ${t("export_empty_zone")}`);
        lines.push("");
        return;
      }

      zoneItems
        .sort((a, b) => computeDaysLeft(a.expiryDate) - computeDaysLeft(b.expiryDate))
        .forEach((item, itemIndex) => {
          const days = computeDaysLeft(item.expiryDate);
          const status = deriveStatus(item, days);
          lines.push(
            `        ${itemIndex + 1}. ${item.name} | ${item.amount}${item.unit} | ${categoryLabel(item.category)} | ${getStatusLabel(status)}`
          );
          lines.push(`           + ${formatDate(item.addedDate)} -> ${formatDate(item.expiryDate)} | ${formatDaysLeft(days)}`);
          if (item.note) {
            lines.push(`           + note: ${item.note}`);
          }
        });
      lines.push("");
    });
    lines.push(divider);
  });

  return lines.join("\n");
}

function downloadTextFile(fileName, content) {
  const bom = "\uFEFF";
  const blob = new Blob([bom, content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function onLibraryChipClick(event) {
  const button = event.target.closest("[data-library-id]");
  if (!button) return;
  const id = button.getAttribute("data-library-id");
  if (!id) return;
  const item = state.ingredientLibrary.find((entry) => entry.id === id);
  if (!item) return;
  applyLibraryTemplate(item);
}

function onSaveCurrentItemToLibrary() {
  const name = cleanText(els.itemName.value);
  if (!name) {
    showToast("请先填写食材名，再保存到食材库。");
    return;
  }
  const unit = cleanText(els.itemUnit.value) || "份";
  const category = CATEGORY_LABEL.zh[els.itemCategory.value] ? els.itemCategory.value : "other";
  const added = normalizeDate(els.itemAddedDate.value) || todayISO();
  const expiry = normalizeDate(els.itemExpiryDate.value) || todayISO();
  const days = Math.max(1, daysBetween(added, expiry));
  const note = cleanText(els.itemNote.value);

  const existing = findIngredientByExactName(name);
  const now = new Date().toISOString();
  if (existing) {
    if (existing.locked) {
      showToast("经典食材已存在，可直接引用。");
      return;
    }
    existing.unit = unit;
    existing.category = category;
    existing.defaultDaysValid = clamp(days, 1, 60);
    existing.note = note;
    existing.updatedAt = now;
    persistAndRender();
    renderLibrarySuggestions(els.itemLibraryQuery.value || name);
    showToast("已更新到食材库。");
    return;
  }

  state.ingredientLibrary.push({
    id: makeId(),
    name,
    aliases: [],
    unit,
    category,
    defaultDaysValid: clamp(days, 1, 60),
    note,
    locked: false,
    createdAt: now,
    updatedAt: now,
  });
  trimIngredientLibrary();
  persistAndRender();
  renderLibrarySuggestions(name);
  showToast("已保存到食材库。");
}

function onSaveLibraryItem(event) {
  event.preventDefault();
  const id = cleanText(els.libraryItemId.value);
  const name = cleanText(els.libraryName.value);
  const unit = cleanText(els.libraryUnit.value) || "份";
  const category = CATEGORY_LABEL.zh[els.libraryCategory.value] ? els.libraryCategory.value : "other";
  const defaultDaysValid = clamp(Math.round(toNumber(els.libraryDaysValid.value, 5)), 1, 60);
  const aliases = normalizeAliases(els.libraryAliases.value);
  const note = cleanText(els.libraryNote.value);

  if (!name) {
    showToast("食材名不能为空。");
    return;
  }

  const now = new Date().toISOString();
  if (id) {
    const target = state.ingredientLibrary.find((entry) => entry.id === id);
    if (!target) {
      showToast("未找到要编辑的食材库条目。");
      return;
    }
    if (target.locked) {
      showToast("经典食材不支持直接编辑，可新建自定义版本。");
      return;
    }
    target.name = name;
    target.unit = unit;
    target.category = category;
    target.defaultDaysValid = defaultDaysValid;
    target.aliases = aliases;
    target.note = note;
    target.updatedAt = now;
    trimIngredientLibrary();
    persistAndRender();
    resetLibraryForm();
    renderLibraryList();
    renderLibrarySuggestions(name);
    showToast("食材库已更新。");
    return;
  }

  const sameName = findIngredientByExactName(name);
  if (sameName) {
    if (sameName.locked) {
      showToast("经典食材已存在，建议使用别名区分。");
      return;
    }
    sameName.unit = unit;
    sameName.category = category;
    sameName.defaultDaysValid = defaultDaysValid;
    sameName.aliases = aliases;
    sameName.note = note;
    sameName.updatedAt = now;
    trimIngredientLibrary();
    persistAndRender();
    resetLibraryForm();
    renderLibraryList();
    renderLibrarySuggestions(name);
    showToast("已按同名覆盖自定义食材。");
    return;
  }

  state.ingredientLibrary.push({
    id: makeId(),
    name,
    aliases,
    unit,
    category,
    defaultDaysValid,
    note,
    locked: false,
    createdAt: now,
    updatedAt: now,
  });
  trimIngredientLibrary();
  persistAndRender();
  resetLibraryForm();
  renderLibraryList();
  renderLibrarySuggestions(name);
  showToast("已添加到食材库。");
}

function onLibraryListAction(event) {
  const actionNode = event.target.closest("[data-library-action]");
  if (!actionNode) return;
  const id = actionNode.getAttribute("data-library-id");
  const action = actionNode.getAttribute("data-library-action");
  if (!id || !action) return;

  const entry = state.ingredientLibrary.find((item) => item.id === id);
  if (!entry) return;

  if (action === "use") {
    applyLibraryTemplate(entry);
    openModal("item", { preserveFormState: true });
    return;
  }

  if (action === "edit") {
    if (entry.locked) {
      showToast("经典食材建议保留，可新增自定义版本。");
      return;
    }
    els.libraryItemId.value = entry.id;
    els.libraryName.value = entry.name;
    els.libraryUnit.value = entry.unit;
    els.libraryCategory.value = entry.category;
    els.libraryDaysValid.value = String(entry.defaultDaysValid);
    els.libraryAliases.value = entry.aliases.join(", ");
    els.libraryNote.value = entry.note || "";
    els.saveLibraryItemBtn.textContent = "更新食材";
    els.libraryName.focus();
    return;
  }

  if (action === "delete") {
    if (entry.locked) {
      showToast("经典食材不可删除。");
      return;
    }
    const ok = window.confirm(`删除食材库条目「${entry.name}」？`);
    if (!ok) return;
    state.ingredientLibrary = state.ingredientLibrary.filter((item) => item.id !== id);
    persistAndRender();
    resetLibraryForm();
    renderLibraryList();
    renderLibrarySuggestions(els.itemLibraryQuery.value);
    showToast("已删除食材库条目。");
  }
}

function findIngredientByExactName(name) {
  const token = searchToken(name);
  if (!token) return null;
  return state.ingredientLibrary.find((entry) => searchToken(entry.name) === token) || null;
}

function scoreLibraryMatch(entry, token) {
  if (!token) return entry.locked ? 8 : 6;

  const nameToken = searchToken(entry.name);
  let score = 0;

  if (nameToken === token) {
    score = 120;
  } else if (nameToken.startsWith(token)) {
    score = 98;
  } else if (nameToken.includes(token)) {
    score = 80;
  }

  for (const alias of entry.aliases) {
    const aliasToken = searchToken(alias);
    if (!aliasToken) continue;
    if (aliasToken === token) {
      score = Math.max(score, 114);
    } else if (aliasToken.startsWith(token)) {
      score = Math.max(score, 94);
    } else if (aliasToken.includes(token)) {
      score = Math.max(score, 76);
    }
  }

  if (score > 0 && entry.locked) {
    score += 2;
  }

  return score;
}

function findLibraryMatches(query, limit = MAX_LIBRARY_SUGGESTIONS) {
  const safeLimit = clamp(Math.round(toNumber(limit, MAX_LIBRARY_SUGGESTIONS)), 1, 40);
  const token = searchToken(query);
  const library = Array.isArray(state.ingredientLibrary) ? state.ingredientLibrary : [];
  if (!library.length) return [];

  if (!token) {
    return library.slice().sort(sortIngredientLibrary).slice(0, safeLimit);
  }

  return library
    .map((entry) => ({
      entry,
      score: scoreLibraryMatch(entry, token),
    }))
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      if (a.entry.locked !== b.entry.locked) return a.entry.locked ? -1 : 1;
      if (a.entry.name.length !== b.entry.name.length) return a.entry.name.length - b.entry.name.length;
      return a.entry.name.localeCompare(b.entry.name, getCurrentLocale());
    })
    .slice(0, safeLimit)
    .map((row) => row.entry);
}

function findBestLibraryMatch(query) {
  const token = searchToken(query);
  if (!token) return null;
  const exact = state.ingredientLibrary.find((entry) => searchToken(entry.name) === token);
  if (exact) return exact;
  return findLibraryMatches(query, 1)[0] || null;
}

function applyLibraryTemplate(entry) {
  if (!entry) return;
  const template = normalizeIngredient(entry);
  if (!template) return;

  const added = normalizeDate(els.itemAddedDate.value) || todayISO();
  const expiry = dayOffsetFrom(added, template.defaultDaysValid);

  els.itemLibraryQuery.value = template.name;
  els.itemName.value = template.name;
  els.itemUnit.value = template.unit;
  els.itemCategory.value = template.category;
  els.itemAddedDate.value = added;
  els.itemExpiryDate.value = expiry;
  if (!cleanText(els.itemAmount.value) || toNumber(els.itemAmount.value, 0) <= 0) {
    els.itemAmount.value = "1";
  }
  if (!cleanText(els.itemNote.value) && template.note) {
    els.itemNote.value = template.note;
  }

  refreshItemDerivedOutputs();
  renderLibrarySuggestions(template.name);
  showToast(`已引用食材库：${template.name}`);
}

function resetLibraryForm() {
  els.libraryForm.reset();
  els.libraryItemId.value = "";
  els.libraryName.value = "";
  els.libraryUnit.value = "份";
  els.libraryCategory.value = "vegetable";
  els.libraryDaysValid.value = "5";
  els.libraryAliases.value = "";
  els.libraryNote.value = "";
  els.saveLibraryItemBtn.textContent = "保存到食材库";
}

function renderLibrarySuggestions(query = "") {
  const matches = findLibraryMatches(query, MAX_LIBRARY_SUGGESTIONS);
  els.librarySuggestions.innerHTML = matches
    .map(
      (entry) =>
        `<option value="${escapeHtml(entry.name)}">${escapeHtml(
          `${categoryLabel(entry.category)} · ${entry.unit} · ${entry.defaultDaysValid}${t("label_day")}`
        )}</option>`
    )
    .join("");

  if (!matches.length) {
    els.librarySuggestionChips.innerHTML = `<span class="chip-suggestion-tip">未命中，继续输入更短关键词。</span>`;
    return;
  }

  els.librarySuggestionChips.innerHTML = matches
    .map(
      (entry) => `
      <button type="button" class="chip-suggestion-btn" data-library-id="${entry.id}" aria-label="引用 ${escapeHtml(entry.name)}">
        <span class="chip-name">${escapeHtml(entry.name)}</span>
        <span class="chip-meta">${escapeHtml(entry.unit)} · ${entry.defaultDaysValid}天</span>
      </button>
    `
    )
    .join("");
}

function renderLibraryList() {
  const library = Array.isArray(state.ingredientLibrary) ? state.ingredientLibrary.slice().sort(sortIngredientLibrary) : [];
  els.libraryCount.textContent = String(library.length);

  if (!library.length) {
    els.libraryList.innerHTML = `<div class="empty-state">食材库为空，先新增一个常用食材。</div>`;
    return;
  }

  const visible = library.slice(0, MAX_LIBRARY_LIST);
  const html = visible
    .map((entry) => {
      const aliases = entry.aliases.length ? `别名：${entry.aliases.join(" / ")}` : "";
      const note = entry.note ? `备注：${entry.note}` : "";

      return `
        <article class="library-card ${entry.locked ? "locked" : ""}">
          <div class="library-head-row">
            <div>
              <div class="library-name-row">
                <strong>${escapeHtml(entry.name)}</strong>
                ${entry.locked ? `<span class="badge">经典</span>` : `<span class="badge">自定义</span>`}
              </div>
              <div class="library-base-meta">${categoryLabel(entry.category)} · ${escapeHtml(entry.unit)} · ${t("label_default")} ${entry.defaultDaysValid} ${t("label_day")}</div>
            </div>
            <div class="library-actions">
              ${libraryActionButtonMarkup("use", "引用", entry.id)}
              ${libraryActionButtonMarkup("edit", "编辑", entry.id, false, entry.locked)}
              ${libraryActionButtonMarkup("delete", "删除", entry.id, true, entry.locked)}
            </div>
          </div>
          ${aliases ? `<div class="library-extra">${escapeHtml(aliases)}</div>` : ""}
          ${note ? `<div class="library-extra">${escapeHtml(note)}</div>` : ""}
        </article>
      `;
    })
    .join("");

  const tail =
    library.length > MAX_LIBRARY_LIST
      ? `<div class="empty-state">已显示前 ${MAX_LIBRARY_LIST} 条，建议清理不常用自定义食材。</div>`
      : "";

  els.libraryList.innerHTML = html + tail;
}

function libraryActionButtonMarkup(action, label, id, danger = false, disabled = false) {
  return `
    <button
      type="button"
      class="mini-btn mini-btn-compact ${danger ? "danger" : ""}"
      data-library-action="${action}"
      data-library-id="${id}"
      aria-label="${label}"
      title="${label}"
      ${disabled ? "disabled" : ""}
    >
      <span class="mini-icon" aria-hidden="true">${libraryActionIcon(action)}</span>
      <span>${label}</span>
    </button>
  `;
}

function libraryActionIcon(action) {
  if (action === "use") {
    return '<svg viewBox="0 0 24 24"><path d="M11 4a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V4Z"/></svg>';
  }
  if (action === "edit") {
    return '<svg viewBox="0 0 24 24"><path d="M15.73 3.15a3 3 0 0 1 4.24 4.24l-9.7 9.7a1 1 0 0 1-.45.26l-4 1a1 1 0 0 1-1.21-1.21l1-4a1 1 0 0 1 .26-.45l9.86-9.54ZM6.1 14.6l-.54 2.15 2.15-.54 8.9-8.9-1.6-1.6-8.9 8.9Z"/></svg>';
  }
  return '<svg viewBox="0 0 24 24"><path d="M9 3a1 1 0 0 0-1 1v1H5a1 1 0 1 0 0 2h.07l1.1 12.11A3 3 0 0 0 9.16 22h5.68a3 3 0 0 0 2.99-2.89L18.93 7H19a1 1 0 1 0 0-2h-3V4a1 1 0 1 0-2 0v1h-4V4a1 1 0 0 0-1-1Zm-.92 4h7.84l-1.07 11.93a1 1 0 0 1-1 .92H10.15a1 1 0 0 1-1-.92L8.08 7Z"/></svg>';
}

function onActionFromList(event) {
  const button = event.target.closest("[data-item-action]");
  if (!button) return;

  const action = button.getAttribute("data-item-action");
  const zoneId = button.getAttribute("data-zone-id");
  const itemId = button.getAttribute("data-item-id");

  if (!action || !zoneId || !itemId) return;
  handleItemAction(action, zoneId, itemId);
}

function handleItemAction(action, zoneId, itemId) {
  const fridge = getActiveFridge();
  if (!fridge) return;

  const zone = fridge.zones.find((entry) => entry.id === zoneId);
  if (!zone) return;

  const item = zone.items.find((entry) => entry.id === itemId);
  if (!item) return;

  if (action === "edit") {
    startEditItem(zone, item);
    return;
  }

  if (action === "extend") {
    quickExtendExpiry(fridge, zone, item);
    return;
  }

  if (action === "consume") {
    completeItem(fridge, zone, item, "consumed");
    return;
  }

  if (action === "discard") {
    const ok = window.confirm(`确认丢弃「${item.name}」并移除？`);
    if (!ok) return;
    completeItem(fridge, zone, item, "wasted");
  }
}

function startEditItem(zone, item) {
  state.selectedZoneId = zone.id;

  els.itemId.value = item.id;
  els.itemSourceZoneId.value = zone.id;
  els.itemName.value = item.name;
  els.itemAmount.value = String(item.amount);
  els.itemUnit.value = item.unit;
  els.itemAddedDate.value = normalizeDate(item.addedDate) || todayISO();
  els.itemExpiryDate.value = normalizeDate(item.expiryDate) || todayISO();
  els.itemStatus.value = item.status || "Auto";
  els.itemCategory.value = CATEGORY_LABEL.zh[item.category] ? item.category : "other";
  els.itemNote.value = item.note || "";
  renderItemZoneOptions();
  els.itemZoneId.value = zone.id;

  els.itemSubmitBtn.textContent = "保存食材";
  els.cancelEditItemBtn.classList.remove("hidden");
  refreshItemDerivedOutputs();
  saveState();
  render();
  openModal("item", { preserveFormState: true });
  showToast(`正在编辑：${item.name}`);
}

function quickExtendExpiry(fridge, zone, item) {
  const days = computeDaysLeft(item.expiryDate);
  const add = days < 0 ? 1 : 2;
  const nextDate = dayOffsetFrom(item.expiryDate, add);
  item.expiryDate = nextDate;
  item.updatedAt = new Date().toISOString();
  zone.updatedAt = item.updatedAt;
  fridge.updatedAt = item.updatedAt;
  persistAndRender();
  showToast(`已将 ${item.name} 的到期日延后 ${add} 天。`);
}

function completeItem(fridge, zone, item, action) {
  zone.items = zone.items.filter((entry) => entry.id !== item.id);

  const now = new Date().toISOString();
  const daysLeft = computeDaysLeft(item.expiryDate);

  state.logs.unshift({
    id: makeId(),
    fridgeId: fridge.id,
    fridgeName: fridge.name,
    zoneName: zone.name,
    itemName: item.name,
    action,
    daysLeftAtAction: daysLeft,
    at: now,
  });

  if (state.logs.length > 500) {
    state.logs = state.logs.slice(0, 500);
  }

  zone.updatedAt = now;
  fridge.updatedAt = now;

  if (els.itemId.value === item.id) {
    resetItemForm();
  }

  persistAndRender();
  if (action === "consumed") {
    showToast(`已记录用完：${item.name}`);
  } else {
    showToast(`已记录丢弃：${item.name}`);
  }
}

function resetItemForm(keepTargetZone = false) {
  const fridge = getActiveFridge();
  const selectedZone = getSelectedZone(fridge);
  const preservedZoneId = keepTargetZone ? els.itemZoneId.value : selectedZone?.id;

  els.itemForm.reset();
  els.itemId.value = "";
  els.itemSourceZoneId.value = "";
  els.itemLibraryQuery.value = "";

  els.itemAmount.value = "1";
  els.itemUnit.value = "份";
  els.itemAddedDate.value = todayISO();
  els.itemExpiryDate.value = todayISO();
  els.itemStatus.value = "Auto";
  els.itemCategory.value = "vegetable";
  els.itemNote.value = "";

  renderItemZoneOptions();
  if (preservedZoneId && optionExists(els.itemZoneId, preservedZoneId)) {
    els.itemZoneId.value = preservedZoneId;
  }

  els.itemSubmitBtn.textContent = "添加食材";
  els.cancelEditItemBtn.classList.add("hidden");
  renderLibrarySuggestions("");
  refreshItemDerivedOutputs();
}

function refreshItemDerivedOutputs() {
  const amount = toNumber(els.itemAmount.value, 0);
  const days = computeDaysLeft(els.itemExpiryDate.value);
  const manualStatus = cleanText(els.itemStatus.value) || "Auto";
  const autoStatus = deriveStatus({ amount, status: "Auto" }, days);
  const displayStatus = manualStatus === "Auto" ? autoStatus : manualStatus;
  els.itemDaysLeft.textContent = `${formatDaysLeft(days)} | ${getStatusLabel(displayStatus)}`;
}

function computeStateMetrics() {
  const fridgeStats = new Map();
  let totalItems = 0;
  let totalExpired = 0;
  let totalRescue = 0;

  for (const fridge of state.fridges) {
    let fridgeItems = 0;
    let fridgeExpired = 0;
    let fridgeRescue = 0;

    for (const zone of fridge.zones) {
      for (const item of zone.items) {
        const days = computeDaysLeft(item.expiryDate);
        fridgeItems += 1;
        totalItems += 1;
        if (typeof days === "number" && days < 0) {
          fridgeExpired += 1;
          totalExpired += 1;
        } else if (typeof days === "number" && days <= 2) {
          fridgeRescue += 1;
          totalRescue += 1;
        }
      }
    }

    fridgeStats.set(fridge.id, { items: fridgeItems, expired: fridgeExpired, rescue: fridgeRescue });
  }

  return {
    totalItems,
    totalExpired,
    totalRescue,
    fridgeStats,
    logs30: getLogsInLastDays(30),
  };
}

function render() {
  ensureSelectionIntegrity();
  const metrics = computeStateMetrics();
  const activeFridge = getActiveFridge();
  const rescueQueue = activeFridge ? buildRescueQueue(activeFridge) : [];
  renderDoorState();
  renderGlobalKpi(metrics);
  renderActionButtons();
  renderFleet(metrics);
  renderAuditCard(rescueQueue);
  renderActiveFridgeSettings();
  renderRiskOverview(metrics);
  renderFridgeVisual();
  renderRescueList(rescueQueue);
  renderIdeaList(rescueQueue);
  renderZoneEditor();
  renderItemZoneOptions();
  renderZoneItemsList();
  renderLedger(metrics.logs30);
  if (ui.activeModalId === "item") {
    renderLibrarySuggestions(els.itemLibraryQuery.value);
  }
  if (ui.activeModalId === "library") {
    renderLibraryList();
  }
  if (ui.activeModalId === "manual") {
    renderManualContent();
  }
  refreshItemDerivedOutputs();
}

function renderActionButtons() {
  const fridge = getActiveFridge();
  const zone = getSelectedZone(fridge);

  els.openEditFridgeModalBtn.disabled = !fridge;
  els.openCreateZoneModalBtn.disabled = !fridge;
  els.openEditZoneModalBtn.disabled = !zone;
  els.openAddItemModalBtn.disabled = !fridge || !fridge.zones.length;
  els.openLibraryModalBtn.disabled = false;
  els.openManualModalBtn.disabled = false;
  els.openExportTxtBtn.disabled = !state.fridges.length;
}

function renderDoorState() {
  els.fridgeCabinet.classList.toggle("door-open", ui.doorOpen);
  els.toggleDoorBtn.textContent = ui.doorOpen ? t("toggle_close_door") : t("toggle_open_door");
}

function renderGlobalKpi(metrics) {
  const wastedCount = metrics.logs30.filter((log) => log.action === "wasted").length;

  els.globalKpi.innerHTML = `
    <span class="kpi-pill">${t("kpi_items")} ${metrics.totalItems}</span>
    <span class="kpi-pill">${t("kpi_rescue")} ${metrics.totalRescue}</span>
    <span class="kpi-pill">${t("kpi_expired")} ${metrics.totalExpired}</span>
    <span class="kpi-pill">${t("kpi_wasted_30")} ${wastedCount}</span>
  `;
}

function renderFleet(metrics) {
  if (!state.fridges.length) {
    els.fridgeFleet.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_fridge"))}</div>`;
    return;
  }

  const html = state.fridges
    .map((fridge) => {
      const isActive = fridge.id === state.activeFridgeId;
      const stats = metrics.fridgeStats.get(fridge.id) || { items: 0, expired: 0, rescue: 0 };

      return `
        <button type="button" class="fleet-card ${isActive ? "active" : ""}" data-fridge-id="${fridge.id}" aria-label="切换到${escapeHtml(fridge.name)}">
          <div class="name">${escapeHtml(fridge.name)}</div>
          <div class="meta">${escapeHtml(fridge.location || "未设置位置")}</div>
          <div class="badge-row">
            <span class="badge">食材 ${stats.items}</span>
            <span class="badge">临期 ${stats.rescue}</span>
            <span class="badge">过期 ${stats.expired}</span>
          </div>
        </button>
      `;
    })
    .join("");

  els.fridgeFleet.innerHTML = html;
}

function renderAuditCard(rescueQueue = []) {
  const fridge = getActiveFridge();
  if (!fridge) {
    els.auditCard.innerHTML = `<div class="empty-state">请选择一个冰箱。</div>`;
    return;
  }

  const last = fridge.lastAuditDate ? fridge.lastAuditDate : "未检查";
  const streak = fridge.auditStreak || 0;
  const queue = rescueQueue.length;

  els.auditCard.innerHTML = `
    <div class="audit-main">连续检查 ${streak} 天</div>
    <div class="audit-sub">上次检查：${last}</div>
    <div class="audit-sub">当前待处理食材：${queue} 个</div>
  `;
}

function renderActiveFridgeSettings() {
  const fridge = getActiveFridge();
  if (!fridge) {
    els.activeFridgeName.value = "";
    els.activeFridgeLocation.value = "";
    els.activeFridgeTheme.value = DEFAULT_FRIDGE_THEME;
    renderFridgeThemePicker(DEFAULT_FRIDGE_THEME);
    els.deleteFridgeBtn.disabled = true;
    return;
  }

  if (els.activeFridgeName.value !== fridge.name) {
    els.activeFridgeName.value = fridge.name;
  }

  if (els.activeFridgeLocation.value !== (fridge.location || "")) {
    els.activeFridgeLocation.value = fridge.location || "";
  }

  const theme = normalizeFridgeTheme(fridge.theme);
  if (els.activeFridgeTheme.value !== theme) {
    els.activeFridgeTheme.value = theme;
  }
  renderFridgeThemePicker(theme);

  els.deleteFridgeBtn.disabled = countItemsInFridge(fridge) > 0;
}

function renderFridgeThemePicker(selectedTheme) {
  const activeTheme = normalizeFridgeTheme(selectedTheme);
  els.fridgeThemePicker.innerHTML = FRIDGE_THEME_OPTIONS.map((theme) => {
    const active = theme.id === activeTheme;
    return `
      <button
        type="button"
        class="theme-chip ${active ? "active" : ""}"
        data-theme-id="${theme.id}"
        role="radio"
        aria-checked="${active ? "true" : "false"}"
        aria-label="${themeLabel(theme)}"
        title="${themeLabel(theme)}"
      >
        <span class="theme-dot" style="--theme-color:${theme.preview}"></span>
        <span>${themeLabel(theme)}</span>
      </button>
    `;
  }).join("");
}

function renderRiskOverview(metrics) {
  const fridge = getActiveFridge();
  if (!fridge) {
    els.riskOverview.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_fridge"))}</div>`;
    return;
  }

  const stats = metrics.fridgeStats.get(fridge.id) || { expired: 0, rescue: 0 };
  const zonesAtRisk = fridge.zones.filter((zone) =>
    zone.items.some((item) => {
      const days = computeDaysLeft(item.expiryDate);
      return typeof days === "number" && days <= 2;
    })
  ).length;

  els.riskOverview.innerHTML = `
    <article class="risk-card critical">
      <div class="label">${escapeHtml(statusLabel("Expired"))}</div>
      <div class="value">${stats.expired}</div>
      <div class="desc">立即处理，避免误食</div>
    </article>
    <article class="risk-card rescue">
      <div class="label">${escapeHtml(statusLabel("Rescue Now"))}</div>
      <div class="value">${stats.rescue}</div>
      <div class="desc">优先安排进餐或预处理</div>
    </article>
    <article class="risk-card value">
      <div class="label">${escapeHtml(t("btn_create_zone"))}</div>
      <div class="value">${zonesAtRisk}</div>
      <div class="desc">优先清空这些分区的临期食材</div>
    </article>
  `;
}

function renderFridgeVisual() {
  const fridge = getActiveFridge();
  if (!fridge) {
    applyFridgeTheme(DEFAULT_FRIDGE_THEME);
    els.fridgeTitle.textContent = t("fleet_title");
    els.fridgeSubtitle.textContent = t("empty_no_fridge");
    els.zoneGrid.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_zone"))}</div>`;
    return;
  }

  applyFridgeTheme(fridge.theme);
  const selectedZone = getSelectedZone(fridge);
  els.fridgeTitle.textContent = fridge.name;
  els.fridgeSubtitle.textContent = `${fridge.location || "未设置位置"} · 当前分区：${selectedZone ? selectedZone.name : "无"}`;

  if (!fridge.zones.length) {
    els.zoneGrid.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_zone"))}</div>`;
    return;
  }

  const html = fridge.zones
    .map((zone) => {
      const selected = zone.id === state.selectedZoneId;
      const occupancy = zone.capacity ? Math.min(100, Math.round((zone.items.length / zone.capacity) * 100)) : 0;
      const expired = zone.items.filter((item) => computeDaysLeft(item.expiryDate) < 0).length;
      const rescue = zone.items.filter((item) => {
        const days = computeDaysLeft(item.expiryDate);
        return days >= 0 && days <= 2;
      }).length;

      let riskClass = "risk-fresh";
      if (expired > 0) {
        riskClass = "risk-expired";
      } else if (rescue > 0) {
        riskClass = "risk-rescue";
      }

      return `
        <button type="button" class="zone-card ${riskClass} ${selected ? "selected" : ""}" data-zone-id="${zone.id}" aria-label="选择分区 ${escapeHtml(zone.name)}">
          <div class="zone-head">
            <span class="zone-name">${escapeHtml(zone.name)}</span>
            <span class="zone-type">${zoneTypeLabel(zone.type)}</span>
          </div>
          <div class="zone-meta">${zone.items.length} / ${zone.capacity} 占用</div>
          <div class="capacity-track"><div class="capacity-fill" style="width:${occupancy}%"></div></div>
          <div class="zone-foot">
            <span>过期 ${expired}</span>
            <span>优先 ${rescue}</span>
          </div>
        </button>
      `;
    })
    .join("");

  els.zoneGrid.innerHTML = html;
}

function applyFridgeTheme(themeId) {
  const targetTheme = normalizeFridgeTheme(themeId);
  for (const option of FRIDGE_THEME_OPTIONS) {
    els.fridgeCabinet.classList.remove(`theme-${option.id}`);
  }
  els.fridgeCabinet.classList.add(`theme-${targetTheme}`);
}

function renderRescueList(rescueQueue = []) {
  const fridge = getActiveFridge();
  if (!fridge) {
    els.rescueList.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_fridge"))}</div>`;
    return;
  }

  if (!rescueQueue.length) {
    els.rescueList.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_idea"))}</div>`;
    return;
  }

  const html = rescueQueue
    .slice(0, MAX_RENDERED_RESCUE)
    .map((entry) => {
      const days = computeDaysLeft(entry.item.expiryDate);
      const status = deriveStatus(entry.item, days);
      const severity = severityClass(status, days);
      const recommendation = getRecommendation(entry.item, status, days);

      return `
        <article class="rescue-card">
          <div class="rescue-head">
            <div>
              <div class="rescue-item">${escapeHtml(entry.item.name)}</div>
              <div class="rescue-meta">${escapeHtml(entry.zone.name)} · ${entry.item.amount}${escapeHtml(entry.item.unit)}</div>
            </div>
            <span class="severity-chip ${severity}">${escapeHtml(getStatusLabel(status))}</span>
          </div>
          <div class="recommend">${escapeHtml(recommendation)} · 剩余 ${formatDaysLeft(days)}</div>
          <div class="mini-actions">
            ${actionButtonMarkup("edit", "编辑", entry.zone.id, entry.item.id)}
            ${actionButtonMarkup("consume", "用完", entry.zone.id, entry.item.id)}
            ${actionButtonMarkup("discard", "丢弃", entry.zone.id, entry.item.id, true)}
          </div>
        </article>
      `;
    })
    .join("");

  els.rescueList.innerHTML = html;
}

function renderIdeaList(rescueQueue = []) {
  const fridge = getActiveFridge();
  if (!fridge) {
    els.ideaList.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_fridge"))}</div>`;
    return;
  }

  const ideas = buildMealIdeas(fridge, rescueQueue);
  if (!ideas.length) {
    els.ideaList.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_idea"))}</div>`;
    return;
  }

  els.ideaList.innerHTML = ideas
    .map(
      (idea) => `
      <article class="idea-card">
        <div class="idea-title">${escapeHtml(idea.title)}</div>
        <div class="idea-desc">${escapeHtml(idea.desc)}</div>
      </article>
    `
    )
    .join("");
}

function renderZoneEditor() {
  const fridge = getActiveFridge();
  const zone = getSelectedZone(fridge);

  const hasZone = Boolean(zone);
  els.editZoneName.disabled = !hasZone;
  els.editZoneType.disabled = !hasZone;
  els.editZoneCapacity.disabled = !hasZone;
  els.deleteZoneBtn.disabled = !hasZone || zone.items.length > 0 || fridge.zones.length <= 1;

  if (!hasZone) {
    els.editZoneName.value = "";
    els.editZoneType.value = "other";
    els.editZoneCapacity.value = "18";
    return;
  }

  if (els.editZoneName.value !== zone.name) {
    els.editZoneName.value = zone.name;
  }
  els.editZoneType.value = zone.type;
  els.editZoneCapacity.value = String(zone.capacity);
}

function renderItemZoneOptions() {
  const fridge = getActiveFridge();
  if (!fridge || !fridge.zones.length) {
    els.itemZoneId.innerHTML = "";
    els.itemSubmitBtn.disabled = true;
    return;
  }

  const previous = els.itemZoneId.value;
  els.itemZoneId.innerHTML = fridge.zones
    .map((zone) => `<option value="${zone.id}">${escapeHtml(zone.name)} (${zoneTypeLabel(zone.type)})</option>`)
    .join("");

  if (previous && optionExists(els.itemZoneId, previous)) {
    els.itemZoneId.value = previous;
  } else if (state.selectedZoneId && optionExists(els.itemZoneId, state.selectedZoneId)) {
    els.itemZoneId.value = state.selectedZoneId;
  } else {
    els.itemZoneId.value = fridge.zones[0].id;
  }

  els.itemSubmitBtn.disabled = false;
}

function renderZoneItemsList() {
  const fridge = getActiveFridge();
  const zone = getSelectedZone(fridge);

  if (!zone) {
    els.zoneItemsTitle.textContent = t("zone_items_title");
    els.zoneItemsList.innerHTML = `<div class="empty-state">请选择一个分区查看食材。</div>`;
    return;
  }

  els.zoneItemsTitle.textContent = `${t("zone_items_title")}：${zone.name}`;

  if (!zone.items.length) {
    els.zoneItemsList.innerHTML = `<div class="empty-state">该分区为空，建议先录入最近购买的食材。</div>`;
    return;
  }

  const html = zone.items
    .slice()
    .sort((a, b) => computeDaysLeft(a.expiryDate) - computeDaysLeft(b.expiryDate))
    .slice(0, MAX_RENDERED_ZONE_ITEMS)
    .map((item) => {
      const days = computeDaysLeft(item.expiryDate);
      const status = deriveStatus(item, days);
      const sev = severityClass(status, days);

      return `
        <article class="item-card">
          <div class="item-head">
            <div>
              <div class="item-name">${escapeHtml(item.name)}</div>
              <div class="item-meta">${item.amount}${escapeHtml(item.unit)} · ${categoryLabel(item.category)}</div>
            </div>
            <span class="severity-chip ${sev}">${escapeHtml(getStatusLabel(status))}</span>
          </div>
          <div class="item-grid">
            <div>添加：${formatDate(item.addedDate)}</div>
            <div>到期：${formatDate(item.expiryDate)}</div>
            <div>剩余：${formatDaysLeft(days)}</div>
            <div>状态：${escapeHtml(getStatusLabel(status))}</div>
          </div>
          <div class="mini-actions">
            ${actionButtonMarkup("edit", "编辑", zone.id, item.id)}
            ${actionButtonMarkup("consume", "用完", zone.id, item.id)}
            ${actionButtonMarkup("extend", "延期", zone.id, item.id)}
            ${actionButtonMarkup("discard", "丢弃", zone.id, item.id, true)}
          </div>
        </article>
      `;
    })
    .join("");

  els.zoneItemsList.innerHTML = html;
}

function renderLedger(logs30) {
  const safeLogs = Array.isArray(logs30) ? logs30 : getLogsInLastDays(30);
  const wasted = safeLogs.filter((log) => log.action === "wasted");
  const consumed = safeLogs.filter((log) => log.action === "consumed");

  const rescueConsumed = consumed.filter((log) => log.daysLeftAtAction <= 2).length;

  els.ledgerSummary.innerHTML = `
    近30天丢弃次数：<strong>${wasted.length}</strong><br />
    近30天优先处理：<strong>${rescueConsumed}</strong> 次
  `;

  if (!safeLogs.length) {
    els.ledgerList.innerHTML = `<div class="empty-state">${escapeHtml(t("empty_no_log"))}</div>`;
    return;
  }

  els.ledgerList.innerHTML = safeLogs
    .slice(0, MAX_RENDERED_LEDGER)
    .map((log) => {
      const actionText = log.action === "wasted" ? "丢弃" : "用完";
      return `
        <article class="ledger-entry">
          <div class="left">${escapeHtml(log.itemName)} · ${actionText}<br />${escapeHtml(log.fridgeName || "冰箱")} / ${escapeHtml(log.zoneName || "分区")}</div>
          <div class="right">${formatDaysLeft(log.daysLeftAtAction)}<br />${formatDate(log.at)}</div>
        </article>
      `;
    })
    .join("");
}

function buildRescueQueue(fridge) {
  const entries = flattenFridgeItems(fridge)
    .map((entry) => {
      const days = computeDaysLeft(entry.item.expiryDate);
      const status = deriveStatus(entry.item, days);
      return {
        ...entry,
        days,
        status,
        score: rescueScore(entry.item, days),
      };
    })
    .filter((entry) => {
      if (entry.status === "Consumed") return false;
      if (typeof entry.days !== "number") return false;
      return entry.days <= 2;
    })
    .sort((a, b) => b.score - a.score);

  return entries;
}

function buildMealIdeas(fridge, rescueQueue = []) {
  const queue = rescueQueue.length ? rescueQueue : buildRescueQueue(fridge);
  const rescueItems = queue.map((entry) => entry.item);
  const has = (category) => rescueItems.some((item) => item.category === category);
  const picks = pickNames(rescueItems, 3);

  const ideas = [];

  if (has("vegetable") && has("protein")) {
    ideas.push({
      title: "快手炒菜组合",
      desc: "把临期蔬菜和蛋白一起快炒，优先处理两天内到期食材。",
    });
  }

  if (has("dairy") && (has("fruit") || has("drink"))) {
    ideas.push({
      title: "早餐奶昔组合",
      desc: "把乳制品和水果/饮品组合成早餐，减少开封后继续变质。",
    });
  }

  if (has("leftover")) {
    ideas.push({
      title: "剩菜翻新餐",
      desc: "先处理剩菜分区，今天加热后搭配主食优先吃完。",
    });
  }

  if (has("drink")) {
    ideas.push({
      title: "饮品优先日",
      desc: "把临期饮品集中安排在今天，避免零散放到过期。",
    });
  }

  if (queue.length) {
    ideas.push({
      title: "今晚必清单",
      desc: `优先处理：${picks.join("、")}。按先到期先使用的顺序安排。`,
    });
  } else {
    ideas.push({
      title: "维持好状态",
      desc: "当前无高风险食材。建议保持每日检查，继续执行先进先出。",
    });
  }

  return ideas.slice(0, 4);
}

function rescueScore(item, daysLeft) {
  const urgency = daysLeft < 0 ? 100 : Math.max(0, 85 - daysLeft * 20);
  const volume = Math.min(12, item.amount * 1.2);
  return urgency + volume;
}

function deriveStatus(item, daysLeft) {
  if (item.status && item.status !== "Auto") {
    return item.status;
  }

  if (item.amount <= 0) return "Consumed";
  if (typeof daysLeft !== "number") return "Watch";
  if (daysLeft < 0) return "Expired";
  if (daysLeft === 0) return "Critical";
  if (daysLeft <= 2) return "Rescue Now";
  if (daysLeft <= 5) return "Watch";
  return "Fresh";
}

function severityClass(status, daysLeft) {
  if (status === "Expired" || status === "Critical" || daysLeft < 0) {
    return "severity-critical";
  }
  if (status === "Rescue Now") {
    return "severity-rescue";
  }
  if (status === "Watch") {
    return "severity-watch";
  }
  return "severity-fresh";
}

function getRecommendation(item, status, daysLeft) {
  if (status === "Expired") {
    return "已过期，立即处理并记录原因";
  }
  if (status === "Critical") {
    return "建议今天优先使用或进行分装保存";
  }
  if (status === "Rescue Now") {
    return "建议在48小时内安排使用";
  }
  if (status === "Watch") {
    return "建议本周内使用，避免进入高风险";
  }
  return `保持先进先出，${categoryLabel(item.category) || "食材"}状态稳定`;
}

function getStatusLabel(status) {
  return statusLabel(status);
}

function actionButtonMarkup(action, label, zoneId, itemId, danger = false) {
  return `
    <button
      type="button"
      class="mini-btn ${danger ? "danger" : ""}"
      data-item-action="${action}"
      data-zone-id="${zoneId}"
      data-item-id="${itemId}"
      aria-label="${label}"
      title="${label}"
    >
      <span class="mini-icon" aria-hidden="true">${actionIcon(action)}</span>
      <span>${label}</span>
    </button>
  `;
}

function actionIcon(action) {
  if (action === "edit") {
    return '<svg viewBox="0 0 24 24"><path d="M15.73 3.15a3 3 0 0 1 4.24 4.24l-9.7 9.7a1 1 0 0 1-.45.26l-4 1a1 1 0 0 1-1.21-1.21l1-4a1 1 0 0 1 .26-.45l9.86-9.54ZM6.1 14.6l-.54 2.15 2.15-.54 8.9-8.9-1.6-1.6-8.9 8.9Z"/></svg>';
  }
  if (action === "consume") {
    return '<svg viewBox="0 0 24 24"><path d="M20.7 5.3a1 1 0 0 0-1.4 0L9.75 14.84 5.7 10.8a1 1 0 1 0-1.4 1.4l4.75 4.76a1 1 0 0 0 1.4 0L20.7 6.7a1 1 0 0 0 0-1.4Z"/></svg>';
  }
  if (action === "extend") {
    return '<svg viewBox="0 0 24 24"><path d="M12 2a1 1 0 0 1 1 1v1.06a8 8 0 1 1-6.32 2.6 1 1 0 0 1 1.5 1.32A6 6 0 1 0 12 6V7a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1h1Zm0 5a1 1 0 0 1 1 1v3h2a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"/></svg>';
  }
  return '<svg viewBox="0 0 24 24"><path d="M9 3a1 1 0 0 0-1 1v1H5a1 1 0 1 0 0 2h.07l1.1 12.11A3 3 0 0 0 9.16 22h5.68a3 3 0 0 0 2.99-2.89L18.93 7H19a1 1 0 1 0 0-2h-3V4a1 1 0 1 0-2 0v1h-4V4a1 1 0 0 0-1-1Zm-.92 4h7.84l-1.07 11.93a1 1 0 0 1-1 .92H10.15a1 1 0 0 1-1-.92L8.08 7Z"/></svg>';
}

function countItemsInFridge(fridge) {
  return fridge.zones.reduce((sum, zone) => sum + zone.items.length, 0);
}

function flattenFridgeItems(fridge) {
  return fridge.zones.flatMap((zone) => zone.items.map((item) => ({ zone, item })));
}

function flattenAllItems(fridges) {
  return fridges.flatMap((fridge) =>
    fridge.zones.flatMap((zone) => zone.items.map((item) => ({ fridge, zone, item })))
  );
}

function getLogsInLastDays(days) {
  const threshold = Date.now() - days * DAY_MS;
  return state.logs.filter((log) => new Date(log.at).getTime() >= threshold);
}

function pickNames(items, limit) {
  return items
    .slice(0, limit)
    .map((item) => item.name)
    .filter(Boolean);
}

function computeDaysLeft(dateLike) {
  const normalized = normalizeDate(dateLike);
  if (!normalized) return null;

  const expiry = parseISODate(normalized);
  const today = parseISODate(todayISO());
  return Math.ceil((expiry.getTime() - today.getTime()) / DAY_MS);
}

function daysBetween(startISO, endISO) {
  const start = parseISODate(startISO);
  const end = parseISODate(endISO);
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

function dayOffsetISO(offset) {
  const base = parseISODate(todayISO());
  base.setDate(base.getDate() + offset);
  return normalizeDate(base);
}

function dayOffsetFrom(dateLike, offset) {
  const base = parseISODate(normalizeDate(dateLike) || todayISO());
  base.setDate(base.getDate() + offset);
  return normalizeDate(base);
}

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function normalizeDate(value) {
  if (!value) return null;

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseISODate(iso) {
  const normalized = normalizeDate(iso) || todayISO();
  const [y, m, d] = normalized.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(value) {
  return normalizeDate(value) || "--";
}

function formatDaysLeft(days) {
  if (typeof days !== "number") return "--";
  if (days < 0) return `超期 ${Math.abs(days)} 天`;
  if (days === 0) return "今天到期";
  return `${days} 天`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function cleanText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function optionExists(selectEl, value) {
  return Array.from(selectEl.options).some((option) => option.value === value);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function makeId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");

  if (ui.toastTimer) {
    clearTimeout(ui.toastTimer);
  }

  ui.toastTimer = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2000);
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    els.voiceButtons.forEach((button) => {
      button.disabled = true;
      button.setAttribute("aria-label", "当前浏览器不支持语音输入");
    });
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.lang = navigator.language || "zh-CN";

  recognition.addEventListener("result", (event) => {
    const transcript = (event.results?.[0]?.[0]?.transcript || "").trim();
    if (!transcript || !ui.recordingButton) return;

    const targetId = ui.recordingButton.getAttribute("data-voice-target");
    const target = document.getElementById(targetId);
    if (!target) return;

    target.value = transcript;
    target.dispatchEvent(new Event("input", { bubbles: true }));
    showToast("语音输入成功。");
  });

  recognition.addEventListener("error", (event) => {
    const message = event.error === "not-allowed" ? "麦克风权限被拒绝。" : `语音输入失败：${event.error}`;
    showToast(message);
  });

  recognition.addEventListener("end", () => {
    stopVoiceUI();
  });

  ui.speech = recognition;
}

function onToggleVoice(button) {
  if (!ui.speech) {
    showToast("当前浏览器不支持语音输入。");
    return;
  }

  if (ui.recordingButton && ui.recordingButton !== button) {
    try {
      ui.speech.stop();
    } catch (_err) {
      // ignore
    }
    stopVoiceUI();
  }

  if (ui.recordingButton === button) {
    ui.speech.stop();
    return;
  }

  ui.recordingButton = button;
  button.classList.add("recording");
  button.setAttribute("aria-pressed", "true");

  showToast("开始语音输入...");
  try {
    ui.speech.start();
  } catch (_err) {
    stopVoiceUI();
    showToast("无法启动语音，请重试。");
  }
}

function stopVoiceUI() {
  if (!ui.recordingButton) return;
  ui.recordingButton.classList.remove("recording");
  ui.recordingButton.setAttribute("aria-pressed", "false");
  ui.recordingButton = null;
}
