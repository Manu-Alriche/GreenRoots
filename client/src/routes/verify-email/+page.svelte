<!-- src/routes/verify-email/+page.svelte -->
<script>
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let token = '';
	let isLoading = true;
	let success = false;
	let error = '';
	let userEmail = '';
	let userName = '';

	onMount(async () => {
		token = $page.url.searchParams.get('token') || '';
		
		if (!token) {
			error = 'Token de vérification manquant dans l\'URL';
			isLoading = false;
			return;
		}
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/email-verification/verify/${token}`);
			const data = await res.json();

			if (res.ok) {
				success = true;
				userEmail = data.user?.email || '';
				userName = `${data.user?.firstname || ''} ${data.user?.lastname || ''}`.trim();			
				setTimeout(() => {
					goto('/connexion');
				}, 5000);
			} else {
				error = data.message || 'Erreur lors de la vérification';
			}
		} catch (err) {
			error = 'Erreur de connexion au serveur';
		} finally {
			isLoading = false;
		}
	});

	async function resendVerification() {
		if (!userEmail) return;
		
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/email-verification/resend`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: userEmail })
			});

			const data = await res.json();
			if (res.ok) {
				alert('Email de vérification renvoyé !');
			} else {
				alert(data.message || 'Erreur lors de l\'envoi');
			}
		} catch (err) {
			alert('Erreur de connexion');
		}
	}
</script>

<svelte:head>
	<title>Vérification d'email - GreenRoots</title>
	<meta name="description" content="Vérification de votre adresse email GreenRoots" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute inset-0 bg-[url('/Jungle.png')] bg-cover bg-center opacity-5"></div>
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<!-- Content -->
	<div class="relative z-10 relative -mx-4 flex items-center justify-center px-4 pt-25 pb-40">
		<div class="max-w-md w-full">
			<!-- Card -->
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
				{#if isLoading}
					<!-- Loading state -->
					<div class="p-12 text-center">
						<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<svg class="w-8 h-8 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</div>
						<h1 class="text-xl font-bold text-gray-800 mb-2">Vérification en cours...</h1>
						<p class="text-gray-600">Veuillez patienter pendant que nous vérifions votre email.</p>
					</div>
				{:else if success}
					<!-- Success state -->
					<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center">
						<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<h1 class="text-2xl font-bold text-white mb-2">Email vérifié !</h1>
						<p class="text-emerald-100">Votre compte est maintenant activé</p>
					</div>

					<div class="p-8 text-center">
						<div class="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
							<h3 class="text-lg font-semibold text-green-800 mb-2">🎉 Félicitations {userName} !</h3>
							<p class="text-green-700 text-sm mb-4">
								Votre adresse email <strong>{userEmail}</strong> a été vérifiée avec succès.
							</p>
							<p class="text-green-600 text-sm">
								Vous pouvez maintenant vous connecter et profiter de tous les services GreenRoots.
							</p>
						</div>

						<div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
							<h4 class="text-blue-800 font-semibold mb-2">🌳 Prochaines étapes :</h4>
							<ul class="text-blue-700 text-sm space-y-1 text-left">
								<li>• Explorez notre catalogue d'arbres</li>
								<li>• Passez votre première commande</li>
								<li>• Suivez vos contributions environnementales</li>
								<li>• Rejoignez notre communauté de planteurs</li>
							</ul>
						</div>

						<button
							on:click={() => goto('/connexion')}
							class="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 mb-4"
						>
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
							</svg>
							<span>Se connecter maintenant</span>
						</button>

						<p class="text-xs text-gray-500">
							Redirection automatique dans 5 secondes...
						</p>
					</div>
				{:else}
					<!-- Error state -->
					<div class="bg-gradient-to-r from-red-500 to-orange-500 p-8 text-center">
						<div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
						<h1 class="text-2xl font-bold text-white mb-2">Vérification échouée</h1>
						<p class="text-orange-100">Le lien de vérification n'est pas valide</p>
					</div>

					<div class="p-8 text-center">
						<div class="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
							<h3 class="text-lg font-semibold text-red-800 mb-2">❌ Erreur de vérification</h3>
							<p class="text-red-700 text-sm mb-4">{error}</p>
						</div>

						<div class="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
							<h4 class="text-yellow-800 font-semibold mb-2">🤔 Que s'est-il passé ?</h4>
							<ul class="text-yellow-700 text-sm space-y-1 text-left">
								<li>• Le lien a peut-être expiré (24h max)</li>
								<li>• Le lien a déjà été utilisé</li>
								<li>• L'email est peut-être déjà vérifié</li>
								<li>• Le lien est incorrect ou corrompu</li>
							</ul>
						</div>

						<div class="space-y-4">
							<button on:click={() => goto('/inscription')} class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
								</svg>
								<span>Créer un nouveau compte</span>
							</button>

							<a href="/connexion" class="block w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-50 transition-colors duration-300 text-center">Essayer de se connecter</a>
						</div>

						<div class="mt-6 pt-6 border-t border-gray-100">
							<p class="text-gray-500 text-sm mb-4">Besoin d'aide ? Contactez notre support :</p>
							<a href="mailto:support@greenroots.com" class="text-green-600 hover:text-green-700 font-medium text-sm">support@greenroots.com</a>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>