<script>
	export let tree;
	export let isAdmin = false;
	export let index = 0;

	const imageUrl = `${import.meta.env.VITE_API_URL}/images/arbres/${tree.imageUrl}`;
</script>

<div class="group relative">
	<!-- Badge de classement -->
	<div class="absolute -top-4 -left-4 z-20 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
		<span class="text-white font-bold text-lg">#{index + 1}</span>
	</div>

	<!-- Carte produit -->
	<div class="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:scale-105 hover:-translate-y-2 transition-all duration-500 group-hover:shadow-yellow-500/20">
		
		<!-- Image -->
		<div class="relative overflow-hidden">
			<img src={imageUrl} alt={tree.name} class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />
			<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

			<!-- Badge Bestseller -->
			<div class="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
				Bestseller
			</div>
		</div>

		<!-- Contenu -->
		<div class="p-6 space-y-4">
			<h3 class="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
				{tree.name}
			</h3>
			<p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
				{tree.description}
			</p>

			<!-- CTA -->
			<a href={`/produits/${tree.reference}`} class="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center justify-center space-x-2 group-hover:scale-105">
				<span>{isAdmin ? `Modifier ${tree.name}` : 'Découvrir ..'}</span>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>
	</div>
</div>
