<script>
	// @ts-nocheck
	import { user, isAuthenticated } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	export let data;
	
	$: trees = data?.tree || [];
	import { goto } from '$app/navigation';
	$: isAdmin = $user?.role.id === 1;
	$: totalPages = Math.ceil(produits.length / itemsPerPage);
	$: paginatedProduits = produits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
    );
	$: produits = trees;
	
	let mounted = false;
	let produit = data.tree;
	let currentPage = 1;
	const itemsPerPage = 8;
	let notifications = [];
	let notificationId = 0;

	function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
    }
  }

	function showNotification(message, type = 'info', duration = 5000) {
		const id = notificationId++;
		const notification = {
			id,
			message,
			type,
			duration
		};	
		notifications = [notification, ...notifications];	
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	}

	function removeNotification(id) {
		notifications = notifications.filter(n => n.id !== id);
	}

	onMount(() => {
		mounted = true;
	});

	async function handleDeactivate(reference) {
		if (!isAdmin) {
			showNotification('Vous n\'avez pas les permissions pour désactiver un arbre', 'error');
			return;
		}
		try {
			const token = localStorage.getItem('token');			
			const url = `${import.meta.env.VITE_API_URL}/produits/${reference}/deactivate`;			
			const res = await fetch(url, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});				
			if (!res.ok) {
				const responseText = await res.text();
				throw new Error(`Erreur ${res.status}: ${responseText}`);
			}
			showNotification('Arbre retiré de la liste avec succès', 'success');
			goto('/produits', { invalidateAll: true });
		} catch (err) {
			console.error('❌ Désactivation échouée :', err);
			showNotification(`Impossible de retirer le produit: ${err.message}`, 'error');
		}
	}

	async function handleReactivate(reference) {
		if (!isAdmin) {
			showNotification('Vous n\'avez pas les permissions pour réactiver un arbre', 'error');
			return;
		}
		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`${import.meta.env.VITE_API_URL}/produits/${reference}/reactivate`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});		
			
			if (!res.ok) throw new Error('Erreur lors de la réactivation');
			
			showNotification('Arbre remis en ligne avec succès', 'success');
			goto('/produits', { invalidateAll: true });
		} catch (err) {
			console.error('Réactivation échouée :', err);
			showNotification('Impossible de remettre en ligne le produit', 'error');
		}
	}

	async function handleDelete(reference) {
		if (!isAdmin) {
			showNotification('Vous n\'avez pas les permissions pour supprimer un arbre', 'error');
			return;
		}
		try {
			const token = localStorage.getItem('token');			
			const url = `${import.meta.env.VITE_API_URL}/produits/${reference}`;	
			const res = await fetch(url, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!res.ok) {
				const responseText = await res.text();				
				let errorMessage = 'Erreur de suppression';
				try {
					const error = JSON.parse(responseText);
					errorMessage = error.message || errorMessage;
				} catch {
					errorMessage = responseText || errorMessage;
				}
				if (errorMessage.includes('commandes') || errorMessage.includes('désactivation')) {
					showNotification(
						'🚫 Suppression impossible : cet arbre est lié à des commandes existantes. Utilisez plutôt la désactivation pour le retirer de la liste des produits.',
						'warning',
						8000
					);
				} else {
					showNotification(`Impossible de supprimer le produit: ${errorMessage}`, 'error');
				}
				return;
			}
			showNotification('Arbre supprimé définitivement', 'success');
			goto('/produits', { invalidateAll: true });
		} catch (err) {
			console.error('❌ Suppression échouée :', err);
			showNotification(`Impossible de supprimer le produit: ${err.message}`, 'error');
		}
	}
</script>

<!-- Système de notifications -->
{#if notifications.length > 0}
	<div class="fixed top-4 right-4 z-50 space-y-2 w-80 max-w-[calc(100vw-2rem)]">
		{#each notifications as notification (notification.id)}
			<div 
				class="w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out"
				class:translate-x-0={true}
				class:translate-x-full={false}
			>
				<div class="p-4">
					<div class="flex items-start">
						<div class="flex-shrink-0">
							{#if notification.type === 'success'}
								<svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							{:else if notification.type === 'error'}
								<svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							{:else if notification.type === 'warning'}
								<svg class="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
								</svg>
							{:else}
								<svg class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							{/if}
						</div>
						<div class="ml-2 flex-1 min-w-0">
							<p class="text-xs font-medium text-gray-900 mb-1">
								{#if notification.type === 'success'}
									Succès
								{:else if notification.type === 'error'}
									Erreur
								{:else if notification.type === 'warning'}
									Attention
								{:else}
									Information
								{/if}
							</p>
							<p class="text-xs text-gray-600 break-words leading-relaxed">
								{notification.message}
							</p>
						</div>
						<div class="ml-2 flex-shrink-0">
							<button class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none p-1" on:click={() => removeNotification(notification.id)}>
								<span class="sr-only">Fermer</span>
								<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
									<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
								</svg>
							</button>
						</div>
					</div>
				</div>
				<!-- Barre de progression -->
				<div class="h-1 bg-gray-200">
					<div 
						class="h-full transition-all duration-{notification.duration} ease-linear"
						class:bg-green-500={notification.type === 'success'}
						class:bg-red-500={notification.type === 'error'}
						class:bg-yellow-500={notification.type === 'warning'}
						class:bg-blue-500={notification.type === 'info'}
						style="width: 0%; animation: shrink {notification.duration}ms linear forwards;"
					></div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute inset-0 bg-[url('/Graine.avif')] bg-cover bg-center opacity-5"></div>
	<div class="absolute top-10 right-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
	<div class="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

	<!-- Products Grid -->
	<div class="relative z-10 container mx-auto px-4 pb-16">
		<!-- Header -->
		<div class="relative z-10 pt-16 pb-12">
			<div class="text-center">
				<h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4"> Nos Arbres</h1>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto px-4"> Découvrez notre collection d'arbres soigneusement sélectionnés pour embellir votre jardin</p>
			</div>
		</div>
		{#if browser}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{#each paginatedProduits as tree (tree.reference)}
					<div
						class="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-105 hover:-translate-y-2 relative"
					>
						<!-- Badge de statut (visible seulement pour les admins) -->
						{#if isAdmin && tree.status && tree.status !== 'active'}
							<div class="absolute top-2 left-2 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
								{tree.status === 'inactive' ? 'Inactif' : 'Archivé'}
							</div>
						{/if}

						<!-- Image container -->
						<div class="relative overflow-hidden rounded-t-3xl {tree.status === 'inactive' ? 'opacity-60' : ''}">
							<img src="{import.meta.env.VITE_API_URL}/images/arbres/{tree.image_url}" alt={tree.name} class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</div>

						<!-- Content -->
						<div class="p-6 space-y-4">
							<h2 class="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">{tree.name}</h2>

							<p class="text-gray-600 text-sm leading-relaxed line-clamp-3">{tree.description}</p>

							<!-- Price and action -->
							<div class="flex items-center justify-between pt-4">
								<span class="text-2xl font-bold text-green-600">{tree.price}€</span>
								{#if isAdmin}
								<a href="produits/{tree.reference}" class="bg-gradient-to-r from-orange-600 to-red-600  text-white px-3 py-3 rounded-full font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
									<span>Modifier</span>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
									</svg>
								</a>
								{:else}
								<a href="produits/{tree.reference}" class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
									<span>Voir</span>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
									</svg>
								</a>
								{/if}
							</div>
						</div>

						<!-- Actions admin -->
						{#if isAdmin}
							<div class="absolute top-4 right-4 flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
								{#if tree.status === 'active' || !tree.status}
									<!-- Bouton désactiver -->
									<button type="button" class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-orange-200 shadow-md" on:click={() => handleDeactivate(tree.reference)} aria-label="Retirer de la liste"title="Retirer de la liste des produits">
										<svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
										</svg>
									</button>
								{:else}
									<!-- Bouton réactiver -->
									<button type="button" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-200 shadow-md" on:click={() => handleReactivate(tree.reference)} aria-label="Remettre en ligne"title="Remettre en ligne">
										<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
										</svg>
									</button>
								{/if}
								
								<!-- Bouton supprimer définitivement -->
								<button type="button" class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-200 shadow-md" on:click={() => handleDelete(tree.reference)} aria-label="Supprimer définitivement" title="Supprimer définitivement">
									<svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
									</svg>
								</button>
							</div>
						{/if}
					</div>
				{/each}
				
				<!-- Bouton ajouter arbre -->
				{#if isAuthenticated && isAdmin}
					<a href="./produits/ajouter-arbre" class="block h-full group cursor-pointer">
						<div class="h-full bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-dashed border-green-300 hover:border-green-500 hover:scale-105 hover:-translate-y-2 flex items-center justify-center">
							<div class="text-center">
							<div class="mt-3 w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-green-700 group-hover:to-emerald-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
								<svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
								</svg>
							</div>
							<h3 class="text-lg font-semibold text-green-600 group-hover:text-green-700 transition-colors duration-300">Ajouter un arbre</h3>
							</div>
						</div>
					</a>
				{/if}
			</div>
		{:else}
			<!-- Version SSR simplifiée pour éviter l'hydration mismatch -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
				{#each paginatedProduits as tree (tree.reference)}
					<div class="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-105 hover:-translate-y-2 relative">
						<!-- Version SSR sans éléments dynamiques -->
						<div class="relative overflow-hidden rounded-t-3xl">
							<img src="{import.meta.env.VITE_API_URL}/images/arbres/{tree.image_url}" alt={tree.name} class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
						</div>

						<!-- Content -->
						<div class="p-6 space-y-4">
							<h2 class="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">{tree.name}</h2>

							<p class="text-gray-600 text-sm leading-relaxed line-clamp-3">{tree.description}</p>

							<!-- Price and action -->
							<div class="flex items-center justify-between pt-4">
								<span class="text-2xl font-bold text-green-600">{tree.price}€</span>
								<a href="produits/{tree.reference}" class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2">
									<span>Voir</span>
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
									</svg>
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
		<div class="flex justify-center mt-8 space-x-2">
				{#each Array(totalPages) as _, i}
					<button
							class="cursor-pointer px-3 py-1 rounded-full font-semibold {currentPage === i + 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}"on:click={() => goToPage(i + 1)}>{i + 1}
					</button>
				{/each}
		</div>
		<!-- Empty state -->
		{#if trees.length === 0}
			<div class="text-center py-16">
				<div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
					</svg>
				</div>
				<h3 class="text-xl font-semibold text-gray-700 mb-2">Aucun arbre disponible</h3>
				<p class="text-gray-500">Nos arbres seront bientôt de retour !</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	@keyframes shrink {
		from { width: 100%; }
		to { width: 0%; }
	}
</style>