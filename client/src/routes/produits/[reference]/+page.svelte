<script>
	// @ts-nocheck
	import { addToTree } from '$lib/stores/tree';
	import { user } from '$lib/stores/auth';
	import { tree as cartStore } from '$lib/stores/tree';
	import { goto } from '$app/navigation';
	import { text } from '@sveltejs/kit';
	export let data;
	const tree = data.tree;
	let quantity = 1;
	let showMessage = false;

	let updatedName = tree.name;
	let updatedDescription = tree.description;
	let updatedStock = tree.stock;
	let updatedPrice = tree.price;
	//let selectedImage = null;

	$: isLoggedIn = !!$user;	
	$: isAdmin = $user?.role.id === 1;
	$: quantityInCart = $cartStore.find(item => item.id === tree.id)?.quantity || 0;	
	$: availableStock = tree.stock - quantityInCart;	
	$: canAddToCart = availableStock > 0 && quantity <= availableStock;

	function handleAdd() {
		if (!isLoggedIn) {
			goto('/connexion');
			return;
		}		
		if (tree.stock === 0) {
			return;
		}
		if (!canAddToCart) {
			return;
		}	
		addToTree({ ...tree, quantity });
		showMessage = true;
		setTimeout(() => (showMessage = false), 2000);
	}
	let selectedImage = null;
	let previewUrl = '';
	function handleImageChange(e) {
		const file = e.target.files[0];
		if (file) {
			selectedImage = file;
			previewUrl = URL.createObjectURL(file);
		}
	}

	async function handleUpdate() {
		const token = localStorage.getItem('token');
		if (!token) {
			alert("Vous devez être connecté en tant qu'admin pour modifier un arbre.");
			return;
		}
		try {
			const formData = new FormData();
			formData.append('name', updatedName);
			formData.append('description', updatedDescription);
			formData.append('stock', updatedStock);
			formData.append('price', updatedPrice);
			if (selectedImage) {
				formData.append('image', selectedImage);
			}
			const res = await fetch(`${import.meta.env.VITE_API_URL}/produits/${tree.reference}`, {
				method: 'PATCH',
				headers: {
					'Authorization': `Bearer ${token}`
				},
				body: formData
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || 'Erreur serveur');
			}
			goto('/produits/');
		} catch (err) {
			console.error(err);
			alert('Erreur lors de la mise à jour: ' + err.message);
		}
	}
	
</script>
<svelte:head>
    <title>GreenRoots | {data.tree?.name || 'Produit'}</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<div class="relative z-10 container mx-auto px-4 py-16">
		<!-- Breadcrumb -->
		<nav class="mb-8">
			<ol class="flex items-center space-x-2 text-sm text-gray-600">
				<li><a href="/" class="hover:text-green-600 transition-colors">Accueil</a></li>
				<li class="text-gray-400">›</li>
				<li><a href="/produits" class="hover:text-green-600 transition-colors">Nos arbres</a></li>
				<li class="text-gray-400">›</li>
				<li class="text-gray-800 font-medium">{tree.name}</li>
			</ol>
		</nav>

		<!-- Product Details -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
			<!-- Image Section -->
			<div class="relative group flex">
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8 flex-1 flex flex-col">
					<div class="flex-1 min-h-[400px] overflow-hidden rounded-2xl"> <!-- Conteneur avec hauteur fixe -->
						<img src="{import.meta.env.VITE_API_URL}/images/arbres/{tree.imageUrl}" alt={tree.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
					</div>
					
					<!-- Le reste de votre code pour le badge et l'admin... -->
					{#if tree.stock > 0}
						<div class="absolute top-12 right-12 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">En stock</div>
					{:else}
						<div class="absolute top-12 right-12 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">Rupture de stock</div>
					{/if}
					{#if isAdmin}
					<div class="py-6">
						<p class="mb-4 text-sm font-semibold text-gray-700">Modifier l'image :</p>
						
						{#if previewUrl}
							<div class="mb-4">
								<!-- svelte-ignore a11y_img_redundant_alt -->
								<img src={previewUrl} alt="Nouvelle image" class="w-full h-48 object-cover rounded-2xl shadow-md" />
							</div>
						{/if}
						
						<label for="image" class="flex flex-col items-center justify-center cursor-pointer text-center">
							<div class="w-full h-48 border-2 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm hover:border-green-500 transition-all duration-300">
								<svg class="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
								</svg>
								<span class="text-green-600 font-semibold">Cliquez pour changer l'image</span>
								<span class="text-gray-500 text-sm mt-1">PNG, JPG, JPEG, GIF ou WebP (max 5MB)</span>
							</div>
						</label>
						<input
							type="file"
							id="image"
							accept="image/*"
							class="hidden"
							on:change={handleImageChange}
						/>
					</div>
					{/if}
				</div>
			</div>

			<!-- Product Info Section -->
			<div class="space-y-8 flex flex-col">
				<!-- Header -->
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
					{#if isAdmin}
					<div class="relative mb-4">
						<label for="productName" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
							<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
							</svg>
							<span>Nom du produit</span>
						</label>
						<textarea 
							id="productName"
							class="w-full text-4xl lg:text-5xl font-bold text-green-600 bg-white/70 backdrop-blur-sm border-2 border-green-200 rounded-2xl px-6 py-4 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 resize-none shadow-sm hover:shadow-md" 
							rows="2" 
							bind:value={updatedName} 
							placeholder="Nom de l'arbre..."
						></textarea>
					</div>
					{:else}
					<h1 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent py-2 mb-4">{tree.name}</h1>
					{/if}
					{#if isAdmin}
					<div class="relative mb-6">
						<label for="updatedPrice" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
							<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
							</svg>
							<span>Prix unitaire</span>
						</label>
						<div class="flex items-center space-x-4">
							<div class="relative flex-1">
								<input 
									id="updatedPrice"
									type="number" 
									step="0.01" 
									min="0"
									class="w-full text-3xl font-bold text-green-600 bg-white/70 backdrop-blur-sm border-2 border-green-200 rounded-2xl px-6 py-4 pr-12 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 shadow-sm hover:shadow-md" 
									bind:value={updatedPrice}
									placeholder="0.00"
								/>
								<span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">€</span>
							</div>
							<span class="text-gray-500 text-lg font-medium">/ unité</span>
						</div>
					</div>
					{:else}
					<div class="flex items-center space-x-4 mb-6">
						<span class="text-3xl font-bold text-green-600">{tree.price} €</span>
						<span class="text-gray-500 text-lg">/ unité</span>
					</div>
					{/if}
					
					{#if isAdmin}
					<div class="relative">
						<label for="productDescription" class="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
							<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
							</svg>
							<span>Description</span>
						</label>
						<textarea
							id="productDescription"
							class="w-full p-6 rounded-2xl border-2 border-green-200 bg-white/70 backdrop-blur-sm shadow-sm text-gray-800 text-lg leading-relaxed resize-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:shadow-md" 
							rows="6" 
							bind:value={updatedDescription}
							placeholder="Décrivez les caractéristiques de cet arbre..."
						></textarea>
					</div>
					{:else}
					<p class="text-gray-700 text-lg leading-relaxed">{tree.description}</p>
					{/if}
				</div>
				

				<!-- Product Details -->
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
					<h3 class="text-xl font-bold text-gray-800 mb-6">Détails du produit</h3>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
								<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
								</svg>
							</div>
							<div class="flex-1">
								<p class="font-semibold text-gray-800">Stock disponible</p>
								{#if tree.stock > 0}
									<p class="text-green-600 font-bold">{tree.stock} unités</p>
								{:else}
									<p class="text-red-600 font-bold">Épuisé</p>
								{/if}
								{#if isAdmin}
								<div class="mt-3">
									<label for="stock" class="block text-xs font-medium text-gray-600 mb-1">Nouveau stock</label>
									<input 
										type="number" 
										step="1" 
										pattern="\d*" 
										id="stock" 
										min="0" 
										bind:value={updatedStock} 
										class="w-full p-3 rounded-xl border-2 border-green-200 bg-white/70 backdrop-blur-sm shadow-sm text-gray-800 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:shadow-md"
										placeholder="Quantité en stock"
									/>
								</div>
								{/if}
							</div>
						</div>

						<div class="flex items-center space-x-3">
							<div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
								<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
								</svg>
							</div>
							<div>
								<p class="font-semibold text-gray-800">Référence</p>
								<p class="text-gray-600">{tree.reference}</p>
							</div>
						</div>
					</div>
				</div>
				{#if isAdmin}
				<div class="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
					<div class="flex items-center justify-between mb-6">
						<h3 class="text-xl font-bold text-gray-800 flex items-center space-x-2">
							<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
							</svg>
							<span>Modifications administrateur</span>
						</h3>
						<div class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
							Mode édition
						</div>
					</div>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-green-50 rounded-2xl border border-green-200">
						<div class="flex items-center space-x-2 text-sm text-green-700">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<span>Modification en temps réel</span>
						</div>
						<div class="flex items-center space-x-2 text-sm text-green-700">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
							</svg>
							<span>Sauvegarde sécurisée</span>
						</div>
					</div>
					
					<button 
						on:click={handleUpdate} 
						class="group w-full relative cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-3 text-lg overflow-hidden"
					>
						<div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
						<svg class="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
						<span class="relative z-10">Enregistrer les modifications</span>
					</button>
				</div>
				{:else}
				<!-- Quantity and Add to Cart -->
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-white/20">
					<h3 class="text-xl font-bold text-gray-800 mb-6">Commander</h3>

					<!-- Quantity Selector -->
					<div class="mb-8">
						<label class="block text-gray-700 font-semibold mb-4" for="selectcount">
							Quantité : <span class="text-green-600 text-xl font-bold">{quantity}</span>
							{#if quantityInCart > 0}
								<span class="text-sm text-gray-500 ml-2">({quantityInCart} déjà dans le panier)</span>
							{/if}
						</label>

						<div class="relative">
							<input
								type="range"
								min="1"
								max={availableStock > 0 ? availableStock : 1}
								bind:value={quantity}
								class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
								id="selectcount"
								disabled={availableStock <= 0}
							/>
							<div class="flex justify-between text-xs text-gray-500 mt-2">
								<span>1</span>
								<span>{availableStock > 0 ? availableStock : 0} disponible{availableStock > 1 ? 's' : ''}</span>
							</div>
						</div>
						
						{#if availableStock <= 0 && quantityInCart > 0}
							<div class="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
								<p class="text-orange-700 text-sm font-medium">Stock épuisé : vous avez déjà ajouté tout le stock disponible dans votre panier.</p>
							</div>
						{/if}
					</div>

					<!-- Add to Cart Button -->
					<button class="cursor-pointer w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50" on:click={handleAdd} disabled={!canAddToCart || tree.stock === 0}>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"></path>
						</svg>
						<span>
							{#if tree.stock === 0}
								Produit épuisé
							{:else if !canAddToCart && availableStock <= 0}
								Stock épuisé dans le panier
							{:else}
								Ajouter au panier
							{/if}
						</span>
					</button>

					<!-- Success Message -->
					{#if showMessage}
						<div class="mt-4 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center space-x-3 animate-pulse">
							<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
								<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							</div>
							<span class="text-green-700 font-semibold">Produit ajouté au panier avec succès !</span>
						</div>
					{/if}

					<!-- Security badges -->
					<div class="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
						<div class="flex items-center space-x-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<span>Paiement sécurisé</span>
						</div>
						<div class="flex items-center space-x-2">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
							</svg>
							<span>Livraison rapide</span>
						</div>
					</div>
				</div>
				{/if}

			</div>
		</div>
	</div>
</div>

<style>
	/* Custom slider styles */
	.slider::-webkit-slider-thumb {
		appearance: none;
		width: 24px;
		height: 24px;
		background: linear-gradient(to right, #059669, #10b981);
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.slider::-moz-range-thumb {
		width: 24px;
		height: 24px;
		background: linear-gradient(to right, #059669, #10b981);
		border-radius: 50%;
		cursor: pointer;
		border: none;
		box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
	}

	.slider::-webkit-slider-track {
		background: linear-gradient(to right, #10b981, #d1fae5);
		border-radius: 8px;
		height: 8px;
	}

	.slider::-moz-range-track {
		background: linear-gradient(to right, #10b981, #d1fae5);
		border-radius: 8px;
		height: 8px;
		border: none;
	}

	input[type="number"]::-webkit-inner-spin-button,
  	input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  	}

  	input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  	}
</style>