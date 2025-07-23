// @ts-ignore
export async function load({ fetch, params }) {
	const { reference } = params;

	const res = await fetch(`${import.meta.env.VITE_API_URL}/produits/${reference}`);
	if (!res.ok) {
		throw new Error(`Erreur lors du chargement du produit avec l'id ${reference}`);
	}
	const tree = await res.json();
	return { tree };
}
