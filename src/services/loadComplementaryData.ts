export async function loadComplementaryData() {
  try {
    console.log("🔎 Tentando carregar dados complementares...");

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const res = await fetch(`${basePath}/dados-complementares.json`);

    console.log("📡 Status da requisição:", res.status);

    if (!res.ok) {
      console.warn("⚠️ Não foi possível carregar dados complementares");
      return {};
    }

    const json = await res.json();

    console.log("✅ Dados complementares carregados:");
    console.log(json);

    return json;
  } catch (error) {
    console.error("❌ Erro ao carregar dados complementares:", error);
    return {};
  }
}