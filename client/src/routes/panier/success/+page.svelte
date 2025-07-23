<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { clearTree } from '$lib/stores/tree';

	let loading = true;
	let orderDetails = null;
	let error = null;
	let orderCreated = false;

	onMount(async () => {
		const sessionId = $page.url.searchParams.get('session_id');
		
		if (!sessionId) {
			error = 'ID de session manquant';
			loading = false;
			return;
		}

		try {
			const token = localStorage.getItem('token');			
			const sessionResponse = await fetch(`${import.meta.env.VITE_API_URL}/payment/session/${sessionId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (sessionResponse.ok) {
				const sessionData = await sessionResponse.json();
				orderDetails = sessionData.session;				
				if (orderDetails.payment_status === 'paid') {
					await createOrder(sessionId, token);
					clearTree();
					orderCreated = true;
				}
			} else {
				error = 'Erreur lors de la récupération des détails de commande';
			}
		} catch (err) {
			console.error('Erreur:', err);
			error = 'Une erreur est survenue';
		} finally {
			loading = false;
		}
	});
	async function createOrder(sessionId, token) {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/create-order-from-session`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ sessionId })
			});
			if (!response.ok) {
				console.error('Erreur lors de la création de la commande');
			}
		} catch (err) {
			console.error('Erreur lors de la création de la commande:', err);
		}
	}

	function goToProfile() {
		goto('/profil');
	}

	function goToProducts() {
		goto('/produits');
	}
</script>

<svelte:head>
	<title>GreenRoots | Commande confirmée</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<div class="relative z-10 container mx-auto px-4 py-16">
		<div class="max-w-2xl mx-auto">
			{#if loading}
				<!-- Loading State -->
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
					<div class="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-6"></div>
					<h2 class="text-2xl font-bold text-gray-800 mb-2">Vérification du paiement...</h2>
					<p class="text-gray-600">Merci de patienter pendant que nous confirmons votre commande.</p>
				</div>
			{:else if error}
				<!-- Error State -->
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
					<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
					<p class="text-gray-600 mb-8">{error}</p>
					
					<div class="flex flex-col sm:flex-row gap-4 justify-center">
						<button 
							on:click={goToProducts}
							class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
						>
							Retour à la boutique
						</button>
					</div>
				</div>
			{:else if orderDetails}
				<!-- Success State -->
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
					<!-- Success Header -->
					<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
						<div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<h1 class="text-3xl font-bold text-white mb-2">Commande confirmée !</h1>
						<p class="text-green-100">Votre paiement a été traité avec succès</p>
						{#if orderCreated}
							<div class="mt-4 inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
								<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
								</svg>
								<span class="text-white text-sm font-medium">Commande créée en base</span>
							</div>
						{/if}
					</div>

					<!-- Order Details -->
					<div class="p-8">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
							<div class="bg-gray-50 rounded-2xl p-6">
								<h3 class="font-bold text-gray-800 mb-4 flex items-center space-x-2">
									<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
									</svg>
									<span>Informations client</span>
								</h3>
								<div class="space-y-2 text-sm">
									<p><span class="font-medium">Email:</span> {orderDetails.customer_email}</p>
									{#if orderDetails.metadata}
										<p><span class="font-medium">Nom:</span> {orderDetails.metadata.firstName} {orderDetails.metadata.lastName}</p>
										<p><span class="font-medium">Localisation:</span> {orderDetails.metadata.localisation}</p>
										{#if orderDetails.metadata.note}
											<p><span class="font-medium">Note:</span> {orderDetails.metadata.note}</p>
										{/if}
									{/if}
								</div>
							</div>

							<div class="bg-gray-50 rounded-2xl p-6">
								<h3 class="font-bold text-gray-800 mb-4 flex items-center space-x-2">
									<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
									</svg>
									<span>Détails du paiement</span>
								</h3>
								<div class="space-y-2 text-sm">
									<p><span class="font-medium">Montant total:</span> {(orderDetails.amount_total / 100).toFixed(2)} €</p>
									<p><span class="font-medium">Statut:</span> 
										<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
											Payé
										</span>
									</p>
								</div>
							</div>
						</div>

						<!-- What's Next -->
						<div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 mb-8">
							<h3 class="font-bold text-gray-800 mb-4 flex items-center space-x-2">
								<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
								<span>Prochaines étapes</span>
							</h3>
							<div class="space-y-3 text-sm text-gray-700">
								<div class="flex items-start space-x-3">
									<div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
									<p>Vous recevrez un email de confirmation dans les prochaines minutes</p>
								</div>
								<div class="flex items-start space-x-3">
									<div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
									<p>Vos arbres seront mis en terre sous 2 jours ouvrés</p>
								</div>
								<div class="flex items-start space-x-3">
									<div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
									<p>Vous pourrez suivre l'avancement de votre commande depuis votre profil</p>
								</div>
							</div>
						</div>

						<!-- Action Buttons -->
						<div class="flex flex-col sm:flex-row gap-4 justify-center">
							<button 
								on:click={goToProfile}
								class="cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
								</svg>
								<span>Voir mes commandes</span>
							</button>
							
							<button 
								on:click={goToProducts}
								class="cursor-pointer bg-white border-2 border-green-300 text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors duration-300 flex items-center justify-center space-x-2"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
								</svg>
								<span>Continuer mes achats</span>
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>