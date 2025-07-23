// @ts-nocheck
export async function load({ fetch }) {
    try {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        const headers = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        } 
        const res = await fetch(`${import.meta.env.VITE_API_URL}/produits`, { headers });    
        if (!res.ok) {
            console.error(`❌ Erreur HTTP ${res.status}:`, await res.text());
            throw new Error(`Erreur HTTP ${res.status}`);
        }
        const tree = await res.json();
        const sortedTree = tree.sort((a, b) => a.name.localeCompare(b.name));
        return { tree };       
    } catch (err) {
        console.error('❌ Erreur lors du fetch:', err);
        throw new Error('Erreur lors du chargement des produits');
    }
}