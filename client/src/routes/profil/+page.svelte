<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import { user, authToken, isAuthenticated, clearAuth } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	
	let orders = [];
	let error = '';
	let loading = true;
	let initialized = false;

	onMount(async () => {
		setTimeout(async () => {
			if ($isAuthenticated && $authToken && $user) {
				await getOrders();
			} else {
				console.log('Non authentifié, redirection...');
				goto('/connexion');
			}
			initialized = true;
		}, 100);
	});

	$: if (initialized && $isAuthenticated && $authToken && $user && orders.length === 0 && !loading) {
		getOrders();
	}

	async function getOrders() {
		if (!$authToken) {
			console.log('Aucun token disponible');
			return;
		}
		loading = true;
		error = '';	
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/commandes`, {
				headers: {
					'Authorization': `Bearer ${$authToken}`,
					'Content-Type': 'application/json'
				}
			});		
			if (!res.ok) {
				if (res.status === 401) {
					clearAuth();
					goto('/connexion');
					return;
				}
				throw new Error(`Erreur ${res.status}: ${res.statusText}`);
			}
			
			orders = await res.json();
		} catch (err) {
			console.error('Erreur lors du chargement des commandes:', err);
			error = 'Erreur de connexion au serveur.';
		} finally {
			loading = false;
		}
	}
</script>
<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute inset-0 bg-[url('/GraineMain.jpg')] bg-cover bg-center opacity-5"></div>
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<!-- Profile Content -->
	<div class="relative z-10 container mx-auto px-4 pb-16">
		<!-- Header -->
		<div class="relative z-10 pt-16 pb-8">
			<div class="text-center">
				<h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Mon Profil</h1>
				<p class="text-lg text-gray-600">Gérez vos informations personnelles et suivez vos commandes</p>
			</div>
		</div>
		<!-- Breadcrumb -->
		<nav class="mb-8 max-w-6xl mx-auto">
			<ol class="flex items-center space-x-2 text-sm text-gray-600">
				<li><a href="/" class="hover:text-green-600 transition-colors">Accueil</a></li>
				<li class="text-gray-400">›</li>
				<li class="text-gray-800 font-medium">Mon Profil</li>
			</ol>
		</nav>

		<!-- Profile Section -->
		<div class="max-w-6xl mx-auto mb-12">
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
				<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
					<h2 class="text-2xl font-bold text-white flex items-center space-x-3">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
						</svg>
						<span>Informations personnelles</span>
					</h2>
				</div>

				<div class="p-8">
					<div class="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
						<!-- Avatar -->
						<div class="flex-shrink-0">
							<div class="relative">
								<div class="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
									<img src="/profil_picture.png" alt="profile_picture" class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"/>
								</div>
								<div class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
									<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
								</div>
							</div>
						</div>

						<!-- User Information -->
						<div class="flex-1 text-center lg:text-left">
							{#if $user}
								<div class="space-y-4">
									<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
											<div class="flex items-center space-x-3 mb-2">
												<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
												</svg>
												<span class="text-sm font-semibold text-gray-600">Nom complet</span>
											</div>
											<p class="text-lg font-bold text-gray-800">{$user.firstName} {$user.lastName}</p>
										</div>

										<div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
											<div class="flex items-center space-x-3 mb-2">
												<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
												</svg>
												<span class="text-sm font-semibold text-gray-600">Email</span>
											</div>
											<p class="text-lg font-bold text-gray-800">{$user.email}</p>
										</div>
									</div>

									<!-- Action Buttons -->
									<div class="flex flex-col sm:flex-row gap-4 pt-4">
										<!-- <button class="flex cursor-pointer items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
											</svg>
											<span>Modifier le profil</span>
										</button> -->
										<a href="/forgot-password" class="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300">
											<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
											</svg>
											<span>Changer le mot de passe</span>
										</a>
									</div>
								</div>
							{:else}
								<div class="flex items-center justify-center space-x-3 text-gray-500">
									<svg class="w-6 h-6 animate-spin"fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
									</svg>
									<span>Chargement des informations...</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Orders History Section -->
		<div class="max-w-6xl mx-auto">
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
				<div class="bg-gradient-to-r from-blue-600 to-cyan-600 p-6">
					<h2 class="text-2xl font-bold text-white flex items-center space-x-3">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
						</svg>
						<span>Historique des commandes</span>
					</h2>
				</div>

				<div class="p-8">
					{#if loading}
						<div class="flex items-center justify-center space-x-3 py-12">
							<svg class="w-8 h-8 animate-spin text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
							</svg>
							<span class="text-lg text-gray-600">Chargement des commandes...</span>
						</div>
					{:else if error}
						<div class="text-center py-12">
							<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-red-600 mb-2">Erreur</h3>
							<p class="text-gray-600">{error}</p>
						</div>
					{:else if orders.length === 0}
						<div class="text-center py-12">
							<div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-gray-700 mb-2">Aucune commande</h3>
							<p class="text-gray-500 mb-6">Vous n'avez pas encore passé de commande</p>
							<a href="/produits" class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
								</svg>
								<span>Découvrir nos arbres</span>
							</a>
						</div>
					{:else}
						<div class="overflow-x-auto">
							<div class="min-w-full">
								<!-- Headers -->
								<div class="grid grid-cols-3 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 font-semibold text-gray-700">
									<div class="flex items-center space-x-2">
										<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
										</svg>
										<span>Date</span>
									</div>
									<div class="flex items-center space-x-2">
										<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
										</svg>
										<span>Référence</span>
									</div>
									<div class="flex items-center space-x-2">
										<svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
										</svg>
										<span>Prix total</span>
									</div>
								</div>

								<!-- Orders -->
								<div class="space-y-3">
									{#each orders as order}
										<div class="grid grid-cols-3 gap-4 bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300">
											<div class="flex items-center">
												<span class="text-gray-700">
													{new Date(order.created_at)
														.toLocaleString('fr-FR', {
															day: '2-digit',
															month: '2-digit',
															year: 'numeric',
															hour: '2-digit',
															minute: '2-digit',
															hour12: false
														})
														.replace(':', 'h') + 'min'}
												</span>
											</div>
											<div class="flex items-center">
												<a href="/profil/commandes/{order.reference}" class="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors duration-300">{order.reference}</a>
											</div>
											<div class="flex items-center">
												<span class="text-lg font-bold text-green-600">
													{order.total.toFixed(2)} €
												</span>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
