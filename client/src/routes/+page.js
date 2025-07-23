// @ts-nocheck
export async function load({ fetch }) {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/produits/bestsellers`);    
        if (!res.ok) {
            console.error(`❌ Erreur HTTP ${res.status}:`, await res.text());
            throw new Error(`Erreur HTTP ${res.status}`);
        }
        const tree = await res.json();   
        return { tree };
    } catch (err) {
        console.error('❌ Erreur lors du fetch:', err);
        throw new Error('Erreur lors du chargement des produits');
    }
}