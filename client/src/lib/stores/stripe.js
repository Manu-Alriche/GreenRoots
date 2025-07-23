// @ts-nocheck
import { loadStripe } from '@stripe/stripe-js';
import { browser } from '$app/environment';

let stripePromise;

export const getStripe = () => {
	if (!browser) return null;

	if (!stripePromise) {
		stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
	}

	return stripePromise;
};

export async function redirectToCheckout(items, formData) {
	try {
		const stripe = await getStripe();
		if (!stripe) {
			throw new Error("Stripe n'a pas pu être chargé");
		}

		const token = localStorage.getItem('token');
		if (!token) {
			throw new Error("Token d'authentification manquant");
		}

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					items: items.map((item) => ({
						treeId: item.id,
						quantity: item.quantity
					})),
					firstName: formData.prenom,
					lastName: formData.nom,
					localisation: formData.localisation,
					note: formData.note
				})
			}
		);

		const session = await response.json();

		if (!response.ok) {
			throw new Error(session.message || 'Erreur lors de la création de la session de paiement');
		}
		const result = await stripe.redirectToCheckout({
			sessionId: session.sessionId
		});

		if (result.error) {
			throw new Error(result.error.message);
		}
	} catch (error) {
		console.error('Erreur lors de la redirection vers Stripe:', error);
		throw error;
	}
}
