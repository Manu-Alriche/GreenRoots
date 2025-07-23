// @ts-nocheck
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Fonction pour charger les données depuis localStorage
function loadFromLocalStorage() {
    if (browser) {
        try {
            const stored = localStorage.getItem('treeCart');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Erreur lors du chargement du panier depuis localStorage:', error);
            return [];
        }
    }
    return [];
}

// Fonction pour sauvegarder dans localStorage
function saveToLocalStorage(items) {
    if (browser) {
        try {
            localStorage.setItem('treeCart', JSON.stringify(items));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du panier dans localStorage:', error);
        }
    }
}

export const tree = writable(loadFromLocalStorage());

tree.subscribe((items) => {
    saveToLocalStorage(items);
});

export function addToTree(newItem) {
    tree.update((items) => {
        const existing = items.find((item) => item.id === newItem.id);
        let updatedItems;
        
        if (existing) {
            updatedItems = items.map((item) =>
                item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
            );
        } else {
            updatedItems = [...items, { ...newItem }];
        }
        return updatedItems;
    });
}

export function removeFromTree(treeId) {
    tree.update((items) => {
        const updatedItems = items.filter((item) => item.id !== treeId);
        return updatedItems;
    });
}

export function clearTree() {
	tree.set([]);
}
