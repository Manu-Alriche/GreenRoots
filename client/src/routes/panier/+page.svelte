<script>
	// @ts-nocheck
	import { tree, clearTree, removeFromTree, addToTree } from '$lib/stores/tree';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { redirectToCheckout } from '$lib/stores/stripe.js';

	let showStockError = false;
	let stockErrorMessage = '';
	let showOrderForm = false;
	let formData = {
		nom: '',
		prenom: '',
		localisation: '',
		note: ''
	};
	let acceptedConditions = false;

	function closeOrderForm() {
		showOrderForm = false;
	}

	function increaseQuantity(item) {
		removeFromTree(item.id);
		addToTree({ ...item, quantity: item.quantity + 1 });
	}

	function decreaseQuantity(item) {
		if (item.quantity <= 1) {
			return;
		}
		removeFromTree(item.id);
		addToTree({ ...item, quantity: item.quantity - 1 });
	}

	async function handleCheckout() {
		const token = localStorage.getItem('token');
		const userId = $user?.id;
		if (!token || !userId) {
			alert('Utilisateur non connecté');
			location.href = '/connexion';
			return;
		}
		
		const stockErrors = [];
		for (const item of $tree) {
			try {
				const res = await fetch(`${import.meta.env.VITE_API_URL}/produits/${item.reference}`);
				if (res.ok) {
					const currentTree = await res.json();
					if (item.quantity > currentTree.stock) {
						stockErrors.push({
							name: item.name,
							requested: item.quantity,
							available: currentTree.stock
						});
					}
				}
			} catch (err) {
				console.error('Erreur lors de la vérification du stock:', err);
			}
		}	
		if (stockErrors.length > 0) {
			if (stockErrors.length === 1) {
				const error = stockErrors[0];
				stockErrorMessage = `Stock insuffisant pour "${error.name}". Vous avez demandé ${error.requested} article${error.requested > 1 ? 's' : ''}, mais seulement ${error.available} disponible${error.available > 1 ? 's' : ''}.`;
			} else {
				stockErrorMessage = `Stock insuffisant pour ${stockErrors.length} articles. Veuillez vérifier les quantités disponibles.`;
			}
			showStockError = true;
			return;
		}		
		showOrderForm = true;
	}

	async function validateOrder() {
		if (!formData.nom.trim() || !formData.prenom.trim() || !formData.localisation.trim()) {
			alert('Veuillez remplir tous les champs obligatoires');
			return;
		}	
		if (!acceptedConditions) {
			alert('Veuillez accepter les conditions générales');
			return;
		}
		try {
			await redirectToCheckout($tree, formData);		
			clearTree();
			showOrderForm = false;
			formData = { nom: '', prenom: '', localisation: '', note: '' };
			acceptedConditions = false;
		} catch (error) {
			console.error('Erreur lors du paiement:', error);
			alert('Erreur lors du paiement: ' + error.message);
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute inset-0 bg-[url('/Jungle.png')] bg-cover bg-center opacity-5"></div>
	<div
		class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
	></div>
	<div
		class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"
	></div>
	<!-- Cart Content -->
	<div class="relative z-10 container mx-auto px-4 pb-16">
		<!-- Header -->
		<div class="relative z-10 pt-16 pb-8">
			<div class="text-center">
				<h1
					class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4"
				>
					Votre Panier
				</h1>
				<p class="text-lg text-gray-600">Récapitulatif de votre sélection d'arbres</p>
			</div>
		</div>
		<div class="max-w-4xl mx-auto">
			<!-- Breadcrumb -->
			<nav class="mb-8">
				<ol class="flex items-center space-x-2 text-sm text-gray-600">
					<li><a href="/" class="hover:text-green-600 transition-colors">Accueil</a></li>
					<li class="text-gray-400">›</li>
					<li><a href="/produits" class="hover:text-green-600 transition-colors">Nos arbres</a></li>
					<li class="text-gray-400">›</li>
					<li class="text-gray-800 font-medium">Panier</li>
				</ol>
			</nav>

			<div
				class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
			>
				<!-- Cart Header -->
				<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
					<h2 class="text-2xl font-bold text-white flex items-center space-x-3">
						<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"></path>
						</svg>
						<span>Récapitulatif de votre panier</span>
					</h2>
				</div>

				<!-- Cart Items -->
				<div class="p-6">
					{#if $tree.length === 0}
						<!-- Empty Cart -->
						<div class="text-center py-16">
							<div
								class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
							>
								<svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"></path>
								</svg>
							</div>
							<h3 class="text-xl font-semibold text-gray-700 mb-2">Votre panier est vide</h3>
							<p class="text-gray-500 mb-6">Découvrez notre collection d'arbres pour commencer vos achats</p>
							<a href="/produits" class="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
								</svg>
								<span>Continuer les achats</span>
							</a>
						</div>
					{:else}
						<!-- Cart Items List -->
						<div class="space-y-4">
							{#each $tree as item}
								<div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
									<div class="flex items-center justify-between">
										<!-- Product Info -->
										<div class="flex items-center space-x-6">
											<div class="relative">
												<img src="{import.meta.env.VITE_API_URL}/images/arbres/{item.image_url}" alt={item.name} class="w-20 h-20 object-cover rounded-xl shadow-md"/>
												<div class="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
													{item.quantity}
												</div>
											</div>

											<div class="flex-1">
												<h3 class="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
												<div class="flex items-center space-x-4 text-sm text-gray-600 mb-3">
													<span>{item.quantity} × {item.price} €</span>
													<span class="w-1 h-1 bg-gray-400 rounded-full"></span>
													<span class="font-semibold text-green-600">Total : {(item.quantity * item.price).toFixed(2)} €</span>
												</div>
												
												<!-- Quantity Controls -->
												<div class="flex items-center space-x-3">
													<span class="text-sm font-medium text-gray-700">Quantité :</span>
													<div class="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm">
														<!-- svelte-ignore a11y_consider_explicit_label -->
														<button on:click={() => decreaseQuantity(item)} disabled={item.quantity <= 1} class="p-2 text-gray-500 hover:text-green-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer" title="Diminuer la quantité">
															<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
															</svg>
														</button>
														
														<span class="px-4 py-2 text-sm font-semibold text-gray-800 min-w-[3rem] text-center">{item.quantity}</span>
														
														<!-- svelte-ignore a11y_consider_explicit_label -->
														<button on:click={() => increaseQuantity(item)} class="p-2 text-gray-500 hover:text-green-600 transition-colors duration-200 cursor-pointer" title="Augmenter la quantité">
															<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
															</svg>
														</button>
													</div>
												</div>
											</div>
										</div>

										<!-- Remove Button -->
										<!-- svelte-ignore a11y_consider_explicit_label -->
										<button class="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-full transition-colors duration-300 group cursor-pointer" on:click={() => removeFromTree(item.id)} title="Retirer du panier">
											<svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
											</svg>
										</button>
									</div>
								</div>
							{/each}
						</div>

						<!-- Cart Summary -->
						<div class="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
							<div class="flex items-center justify-between mb-6">
								<h3 class="text-xl font-bold text-gray-800">Résumé de la commande</h3>
								<div class="text-right">
									<p class="text-sm text-gray-600">
										{$tree.reduce((sum, item) => sum + item.quantity, 0)} article{$tree.reduce((sum, item) => sum + item.quantity,0) > 1 ? 's': ''}
									</p>
									<p class="text-2xl font-bold text-green-600">
										{$tree.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)} €
									</p>
								</div>
							</div>

							<!-- Action Buttons -->
							<div class="flex flex-col sm:flex-row gap-4 justify-between">
								<button class="flex cursor-pointer items-center justify-center space-x-2 bg-white border-2 border-red-300 text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-colors duration-300" on:click={clearTree}>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
									</svg>
									<span>Vider le panier</span>
								</button>

								<button class="flex items-center cursor-pointer justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105" on:click={handleCheckout}>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
									</svg>
									<span>Valider la commande</span>
								</button>
							</div>

							<!-- Security Info -->
							<div class="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-600">
								<div class="flex items-center space-x-2">
									<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.012-3.47A.75.75 0 0121 8.25V15a6 6 0 01-6 6H9a6 6 0 01-6-6V8.25c0-.621.504-1.125 1.125-1.125H8.25"></path>
									</svg>
									<span>Paiement sécurisé</span>
								</div>
								<div class="flex items-center space-x-2">
									<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
									</svg>
									<span>Livraison gratuite dès 50€</span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Stock Error Modal -->
{#if showStockError}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
		<div class="bg-white rounded-3xl shadow-2xl border border-white/20 max-w-md w-full transform transition-all duration-300 scale-100">
			<!-- Modal Header -->
			<div class="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-t-3xl">
				<div class="flex items-center justify-between">
					<h3 class="text-xl font-bold text-white flex items-center space-x-3">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<span>Stock insuffisant</span>
					</h3>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button on:click={closeStockError} class="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>
			
			<!-- Modal Content -->
			<div class="p-6">
				<div class="flex items-start space-x-4 mb-6">
					<div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
						<svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
						</svg>
					</div>
					<div class="flex-1">
						<p class="text-gray-700 leading-relaxed"> {stockErrorMessage} </p>
						<p class="text-sm text-gray-500 mt-2"> Veuillez ajuster les quantités dans votre panier avant de continuer.</p>
					</div>
				</div>
				
				<!-- Modal Actions -->
				<div class="flex flex-col sm:flex-row gap-3">
					<button on:click={closeStockError} class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
						</svg>
						<span>Retour au panier</span>
					</button>
					<a href="/produits" class="flex-1 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center space-x-2">
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
						<span>Continuer les achats</span>
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Order Form Modal -->
{#if showOrderForm}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
		<div class="bg-white rounded-3xl shadow-2xl border border-white/20 max-w-lg w-full transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
			<!-- Modal Header -->
			<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-3xl">
				<div class="flex items-center justify-between">
					<h3 class="text-xl font-bold text-white flex items-center space-x-3">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
						</svg>
						<span>Passer la commande</span>
					</h3>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button on:click={closeOrderForm} class="text-white/80 cursor-pointer hover:text-white p-1 rounded-full hover:bg-white/20 transition-colors duration-200">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
			</div>
			
			<!-- Modal Content -->
			<div class="p-6">
				<p class="text-gray-600 mb-6"> Mise en terre sous 2 jours ouvrés </p>
				
				<!-- Form -->
				<form on:submit|preventDefault={validateOrder} class="space-y-6">
					<!-- Nom et Prénom -->
					<div class="space-y-4">
						<div>
							<label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
								Nom - Prénom
							</label>
							<input
								id="nom"
								type="text"
								bind:value={formData.nom}
								placeholder="Nom"
								class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
								required
							/>
						</div>
						
						<div>
							<input
								type="text"
								bind:value={formData.prenom}
								placeholder="Prénom"
								class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200"
								required
							/>
						</div>
					</div>
					
					<!-- Localisation -->
					<div>
						<label for="localisation" class="block text-sm font-medium text-gray-700 mb-2"> Localisation </label>
						<select id="localisation" bind:value={formData.localisation} class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200" required>
							<option value="">Sélectionnez une localisation</option>
							<option value="paris">Paris</option>
							<option value="lyon">Lyon</option>
							<option value="marseille">Marseille</option>
							<option value="toulouse">Toulouse</option>
							<option value="nice">Nice</option>
							<option value="nantes">Nantes</option>
							<option value="strasbourg">Strasbourg</option>
							<option value="montpellier">Montpellier</option>
							<option value="bordeaux">Bordeaux</option>
							<option value="lille">Lille</option>
						</select>
					</div>
					
					<!-- Note pour le planteur -->
					<div>
						<label for="note" class="block text-sm font-medium text-gray-700 mb-2"> Note pour le planteur </label>
						<textarea
							id="note"
							bind:value={formData.note}
							placeholder="Informations complémentaires..."
							rows="4"
							class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-200 resize-none"
						></textarea>
					</div>
					
					<!-- Conditions générales -->
					<div class="flex items-start space-x-3">
						<input
							type="checkbox"
							id="conditions"
							bind:checked={acceptedConditions}
							class="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
							required
						/>
						<label for="conditions" class="text-sm text-gray-700">J'accepte les conditions générales etc<a href="/mentions" class="text-green-600 hover:text-green-700 underline">Lisez nos conditions générales</a></label>
					</div>
					
					<!-- Submit Button -->
					<button type="submit" class="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
						</svg>
						<span>Payer avec Stripe</span>
					</button>
					
					<!-- Stripe Info -->
					<div class="mt-4 text-center">
						<div class="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
							<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.012-3.47A.75.75 0 0121 8.25V15a6 6 0 01-6 6H9a6 6 0 01-6-6V8.25c0-.621.504-1.125 1.125-1.125H8.25"></path>
							</svg>
							<span>Paiement sécurisé par Stripe</span>
						</div>
						<p class="text-xs text-gray-500">Vos informations de paiement sont protégées et cryptées</p>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}