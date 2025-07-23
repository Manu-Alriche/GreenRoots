<script>
	export let error;
	export let status;
	let message = "Oups ! La page que vous cherchez n'existe pas ou a été déplacée.";
</script>

<svelte:head>
	<title>{status} - Page non trouvée</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse">
	</div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000">
	</div>
	<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500">
	</div>
	<div class="relative z-10 container mx-auto px-4">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
			<!-- Image Section -->
			<div class="order-2 lg:order-1">
				<div class="relative group">
					<!-- Floating elements around image -->
					<div class="absolute -top-8 -left-8 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-bounce">
					</div>
					<div class="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-400 rounded-full opacity-30 animate-bounce delay-300">
					</div>
					<div class="absolute top-1/2 -left-12 w-8 h-8 bg-teal-400 rounded-full opacity-25 animate-bounce delay-700">
					</div>
					<div class="relative">
						<div class="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-500">
						</div>
						<div class="tenor-gif-embed" data-postid="26591013" data-share-method="host" data-aspect-ratio="1" data-width="100%">from <a href="https://tenor.com/search/bebe+griit-gifs">Bebe Griit GIFs</a></div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
						<!-- Floating number 404 -->
						<div class="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 group-hover:rotate-12 transition-transform duration-500">
							<span class="text-4xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
								{status || '404'}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Content Section -->
			<div class="order-1 lg:order-2 text-center lg:text-left">
				<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 border border-white/20">
					{#if status === 404}
						<!-- 404 Specific Content -->
						<div class="space-y-6">
							<!-- Large 404 Title -->
							<div class="relative">
								<h1 class="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg mb-4">
									404
								</h1>
								<div class="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-ping">
								</div>
							</div>

							<h2 class="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">Page non trouvée</h2>

							<p class="text-lg text-gray-600 leading-relaxed mb-6">
								{message}
							</p>

							<p class="text-gray-600 mb-8">
								Pas de panique, vous pouvez retourner à l'accueil ou utiliser le menu pour continuer
								votre navigation.
							</p>
						</div>
					{:else}
						<!-- Generic Error Content -->
						<div class="space-y-6">
							<div class="relative">
								<h1 class="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg mb-4">
									Erreur {status}
								</h1>
								<div class="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full animate-ping">
								</div>
							</div>

							<p class="text-lg text-gray-600 leading-relaxed">
								{error?.message || "Une erreur s'est produite."}
							</p>
						</div>
					{/if}

					<!-- Action Buttons -->
					<div class="flex flex-col sm:flex-row gap-4 mt-8">
						<a href="/" class="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center justify-center space-x-2">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
								</path>
							</svg>
							<span>Retour à l'accueil</span>
						</a>

						<a href="/produits" class="group bg-white border-2 border-green-300 text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 inline-flex items-center justify-center space-x-2">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10">
								</path>
							</svg>
							<span>Voir nos arbres</span>
						</a>
					</div>

					<!-- Help Section -->
					<div class="mt-8 pt-6 border-t border-gray-200">
						<h3 class="text-lg font-semibold text-gray-800 mb-4">Besoin d'aide ?</h3>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
							<a href="/mentions" class="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
									</path>
								</svg>
								<span>Centre d'aide</span>
							</a>
							<a href="/contact" class="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
									</path>
								</svg>
								<span>Nous contacter</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Decorative bottom elements -->
		<div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 text-gray-400">
			<div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
			<div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-300"></div>
			<div class="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-700"></div>
		</div>
	</div>
</div>
