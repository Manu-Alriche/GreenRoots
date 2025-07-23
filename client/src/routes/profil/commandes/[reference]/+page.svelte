<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	export let data;
	let order = null;
	let error = '';
	let loading = true;

	onMount(async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			error = 'Utilisateur non authentifié.';
			loading = false;
			return;
		}
		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/commandes/${data.reference}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!res.ok) {
				error = `Commande non trouvée (${res.status})`;
			} else {
				order = await res.json();
			}
		} catch (e) {
			error = 'Erreur de connexion au serveur.';
			console.error(e);
		} finally {
			loading = false;
		}
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute inset-0 bg-[url('/Graine-erable.jpg')] bg-cover bg-center opacity-5"></div>
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<!-- Content -->
	<div class="relative z-10 container mx-auto px-4 pb-16">
		<!-- Header -->
		<div class="relative z-10 pt-16 pb-8">
			<div class="text-center">
				<h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Détails de la Commande</h1>
				<p class="text-lg text-gray-600">Récapitulatif complet de votre commande</p>
			</div>
		</div>
		<div class="max-w-4xl mx-auto">
			<!-- Breadcrumb -->
			<nav class="mb-8">
				<ol class="flex items-center space-x-2 text-sm text-gray-600">
					<li><a href="/" class="hover:text-green-600 transition-colors">Accueil</a></li>
					<li class="text-gray-400">›</li>
					<li><a href="/profil" class="hover:text-green-600 transition-colors">Profil</a></li>
					<li class="text-gray-400">›</li>
					<li class="text-gray-800 font-medium">Commande {data.reference}</li>
				</ol>
			</nav>

			{#if loading}
				<!-- Loading State -->
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 border border-white/20 text-center">
					<div class="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-6"></div>
					<p class="text-lg text-gray-600">Chargement des détails de la commande...</p>
				</div>
			{:else if error}
				<!-- Error State -->
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-12 border border-white/20 text-center">
					<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
					<h3 class="text-xl font-semibold text-gray-800 mb-4">Erreur de chargement</h3>
					<p class="text-red-600 mb-6">{error}</p>
					<a href="/profil" class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
						</svg>
						<span>Retour au profil</span>
					</a>
				</div>
			{:else}
				<!-- Order Details -->
				<div class="space-y-8">
					<!-- Order Header -->
					<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden">
						<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
							<div class="flex items-center justify-between">
								<div class="flex items-center space-x-3">
									<div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
										</svg>
									</div>
									<div>
										<h2 class="text-2xl font-bold text-white">Commande #{order.reference}</h2>
										<p class="text-green-100">Détails de votre commande</p>
									</div>
								</div>
								<div class="text-right">
									<div class="bg-white/20 rounded-lg px-4 py-2">
										<p class="text-green-100 text-sm">Total</p>
										<p class="text-2xl font-bold text-white">{order.total.toFixed(2)} €</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Order Info -->
						<div class="p-6">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div class="flex items-center space-x-4">
									<div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
										<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v1a2 2 0 104 0v-1m6 0H6"></path>
										</svg>
									</div>
									<div>
										<p class="text-sm text-gray-600">Date de commande</p>
										<p class="font-semibold text-gray-800">
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
										</p>
									</div>
								</div>

								<div class="flex items-center space-x-4">
									<div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
										<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
										</svg>
									</div>
									<div>
										<p class="text-sm text-gray-600">Référence</p>
										<p class="font-semibold text-gray-800">{order.reference}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Order Items -->
					<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden">
						<div class="p-6 border-b border-gray-100">
							<h3 class="text-xl font-bold text-gray-800 flex items-center space-x-2">
								<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
								</svg>
								<span>Articles commandés</span>
							</h3>
						</div>

						<div class="overflow-x-auto">
							<table class="w-full">
								<thead class="bg-gray-50">
									<tr>
										<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arbre</th>
										<th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
										<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix unitaire</th>
										<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-gray-200">
									{#each order.trees as tree}
										<tr class="hover:bg-gray-50 transition-colors">
											<td class="px-6 py-4">
												<div class="flex items-center space-x-3">
													<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
														<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
														</svg>
													</div>
													<div>
														<p class="font-medium text-gray-800">{tree.name}</p>
														<p class="text-sm text-gray-500">Arbre de qualité premium</p>
													</div>
												</div>
											</td>
											<td class="px-6 py-4 text-center">
												<span class="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 text-sm font-medium rounded-full">{tree.OrderItem.quantity}</span>
											</td>
											<td class="px-6 py-4 text-right font-medium text-gray-800">
												{tree.price} €
											</td>
											<td class="px-6 py-4 text-right font-bold text-green-600">
												{(tree.price * tree.OrderItem.quantity).toFixed(2)} €
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>

						<!-- Order Summary -->
						<div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-t border-gray-100">
							<div class="flex justify-between items-center">
								<div class="flex items-center space-x-2">
									<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
									<span class="text-gray-700">
										{order.trees.reduce((sum, tree) => sum + tree.OrderItem.quantity, 0)} article{order.trees.reduce((sum, tree) => sum + tree.OrderItem.quantity, 0) > 1 ? 's': ''} commandé{order.trees.reduce((sum, tree) => sum + tree.OrderItem.quantity, 0) > 1 ? 's'	: ''}
									</span>
								</div>
								<div class="text-right">
									<p class="text-sm text-gray-600">Total de la commande</p>
									<p class="text-2xl font-bold text-green-600">{order.total.toFixed(2)} €</p>
								</div>
							</div>
						</div>
					</div>

					<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden mt-8 p-6">
						<h3 class="text-xl font-bold text-gray-800 mb-4">Informations client</h3>
						<p><span class="font-semibold">Nom :</span> {order.lastName}</p>
						<p><span class="font-semibold">Prénom :</span> {order.firstName}</p>
						<p><span class="font-semibold">Localisation :</span> {order.localisation}</p>
						<p><span class="font-semibold">Note :</span> {order.note}</p>
					</div>

					<!-- Back Button -->
					<div class="text-center">
						<a href="/profil" class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
							</svg>
							<span>Retour au profil</span>
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
