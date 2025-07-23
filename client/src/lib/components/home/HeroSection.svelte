<!-- Hero Section -->
<div class="relative -mx-4 -mt-1 h-screen flex items-center justify-center overflow-hidden">
	<div class="absolute inset-0 bg-cover bg-center bg-fixed" style="background-image: url('/forest.jpg');">
		<div class="absolute inset-0 bg-black/50"></div>
	</div>

	<div class="absolute top-20 right-20 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<div class="relative z-10 text-center px-4">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
				Bienvenue sur
				<span class="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">GreenRoots</span>
			</h1>
			<p class="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
				Agissez pour la planète, un arbre à la fois. Votre plateforme de reforestation responsable.
			</p>

			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/produits" class="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 hover:scale-105 inline-flex items-center justify-center space-x-2">
					<span>Découvrir la boutique</span>
					<svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
					</svg>
				</a>

				<a href="#presentation" class="group bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all duration-300 border border-white/30 inline-flex items-center justify-center space-x-2">
					<span>En savoir plus</span>
					<svg class="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
					</svg>
				</a>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>
</div>
