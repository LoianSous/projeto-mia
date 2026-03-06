export async function loadComplementaryData() {
  try {
    console.log("🔎 Tentando carregar dados complementares...");

    const res = await fetch("/dados-complementares.json");

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