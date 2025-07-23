<script>
	// @ts-nocheck
	import { goto } from '$app/navigation';
	let name = '';
	let price = '';
	let stock = '';
	let description = '';
	let selectedImage = null;
	let previewUrl = '';
	function handleCancel() {
		goto('/produits');
	}
	function handleImageChange(e) {
		const file = e.target.files[0];
		if (file) {
			selectedImage = file;
			previewUrl = URL.createObjectURL(file);
		}
	}
	async function handleCreate() {
		const token = localStorage.getItem('token');
		if (!token) {
			alert("Vous devez être connecté en tant qu'admin pour ajouter un arbre.");
			return;
		}
		if (!selectedImage) {
			alert("Veuillez sélectionner une image.");
			return;
		}
		try {
			const formData = new FormData();
			formData.append('name', name);
			formData.append('description', description);
			formData.append('price', price);
			formData.append('stock', stock);
			formData.append('image', selectedImage);
			const res = await fetch(`${import.meta.env.VITE_API_URL}/produits`, { 
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});
			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || "Erreur serveur");
			}
			window.location.href = "/produits";
		} catch (err) {
			console.error(err);
			alert("Erreur lors de la création de l'arbre: " + err.message);
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute inset-0 bg-[url('/Graine.avif')] bg-cover bg-center opacity-5"></div>
	<div class="absolute top-10 right-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
	<div class="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>

	<div class="relative z-10 container mx-auto px-4 pb-16">
		<!-- Header -->
		<div class="relative z-10 pt-16 pb-12">
			<div class="text-center">
				<h1 class="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">Ajouter un Arbre</h1>
				<p class="text-xl text-gray-600 max-w-2xl mx-auto px-4">Ajoutez un nouvel arbre à votre collection</p>
			</div>
		</div>
		<div class="max-w-2xl mx-auto">
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden">
				<form on:submit|preventDefault={handleCreate} class="p-8 space-y-6">
					<!-- Nom -->
					<div>
						<label for="name" class="block text-sm font-semibold text-gray-700 mb-2">Nom de l'arbre</label>
						<input
							type="text"
							id="name"
							required
							class="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
							placeholder="Ex: Chêne Rouge"
							bind:value={name}
						/>
					</div>

					<!-- Prix -->
					<div>
						<label for="price" class="block text-sm font-semibold text-gray-700 mb-2">Prix (€)</label>
						<input
							type="number"
							id="price"
							step="0.01"
							min="0"
							required
							class="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
							placeholder="Ex: 45.99"
							bind:value={price}
						/>
					</div>

					<!-- Stock -->
					<div>
						<label for="stock" class="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
						<input
							type="number"
							id="stock"
							min="0"
							required
							class="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm"
							placeholder="Ex: 20"
							bind:value={stock}
						/>
					</div>

					<!-- Description -->
					<div>
						<label for="description" class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
						<textarea
							id="description"
							required
							rows="4"
							class="w-full px-4 py-3 border border-green-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
							placeholder="Décrivez les caractéristiques de cet arbre..."
							bind:value={description}
						></textarea>
					</div>

					<!-- Image -->
					<div>
						<label for="image" class="block text-sm font-semibold text-gray-700 mb-2">Image de l'arbre</label>
						
						{#if previewUrl}
							<div class="mb-4">
								<img src={previewUrl} alt="Aperçu" class="w-full h-48 object-cover rounded-2xl shadow-md" />
							</div>
						{/if}
						
						<label for="image" class="flex flex-col items-center justify-center cursor-pointer text-center">
							<div class="w-full h-48 border-2 border-dashed border-green-300 rounded-2xl flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm hover:border-green-500 transition-all duration-300">
								<svg class="w-12 h-12 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
								</svg>
								<span class="text-green-600 font-semibold">Cliquez pour ajouter une image</span>
								<span class="text-gray-500 text-sm mt-1">PNG, JPG, JPEG, GIF ou WebP (max 5MB)</span>
							</div>
						</label>
						<input
							type="file"
							id="image"
							accept="image/*"
							class="hidden"
							on:change={handleImageChange}
							required
						/>
					</div>

					<!-- Boutons -->
					<div class="flex items-center justify-end space-x-4 pt-6 border-t border-green-200">
						<button type="button" on:click={handleCancel} class="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 cursor-pointer">Annuler</button>
						<button type="submit" class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2 cursor-pointer">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
							</svg>
							<span>Ajouter l'arbre</span>
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>