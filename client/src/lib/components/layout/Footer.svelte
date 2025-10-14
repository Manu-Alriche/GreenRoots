<script>
	// @ts-nocheck
	import logo from '$lib/../public/Logo-GR.R.png';
	import { isAuthenticated } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
</script>

<footer class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
	<div class="absolute inset-x-0 bottom-0 h-screen bg-gray-900 translate-y-full -z-10"></div>

	<!-- Background decorative elements -->
	<div class="absolute top-10 right-10 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
	<div class="absolute bottom-10 left-10 w-48 h-48 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>

	<div class="relative z-10 container mx-auto px-4 py-16 max-w-[85rem]">
		<!-- Footer Top -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
			<!-- Brand Section -->
			<div class="space-y-4">
				<div class="flex items-center space-x-2">
					<img src={logo} alt="GreenRoots Logo" class="w-10 h-10" />
					<span class="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">GreenRoots</span>
				</div>
				<p class="text-gray-300 text-sm leading-relaxed">
					Agissez pour la planète, un arbre à la fois. Votre plateforme de reforestation responsable.
				</p>
				<div class="flex space-x-4">
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<a href="https://x.com/" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
						<svg class="w-5 h-5" viewBox="0 0 300 271" fill="currentColor">
							<path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"></path>
						</svg>
					</a>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
					<a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
						<svg class="w-5 h-5" viewBox="0 0 50 50" fill="currentColor">
							<path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z">
						</path>
						</svg>
					</a>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
					<a href="https://www.youtube.com/watch?v=0oyKPIbwOUQ" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
							<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z">
							</path>
						</svg>
					</a>
                    <!-- svelte-ignore a11y_consider_explicit_label -->
					<a href="https://github.com/O-clock-Athenes/GreenRoots-front" target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-300">
						<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5">
							</path>
						</svg>
					</a>
				</div>
			</div>

			<!-- Navigation rapide -->
			<div class="space-y-4">
				<h3 class="text-lg font-bold text-white">Navigation</h3>
				<ul class="space-y-2">
					<li><a href="/" class="text-gray-300 hover:text-green-400 text-sm">Accueil</a></li>
					<li><a href="/produits" class="text-gray-300 hover:text-green-400 text-sm">Boutique</a></li>
					<li><a href="/contact" class="text-gray-300 hover:text-green-400 text-sm">Contact</a></li>
					<li><a href="/connexion" class="text-gray-300 hover:text-green-400 text-sm">Se connecter</a></li>
				</ul>
			</div>

			<!-- Services -->
			<div class="space-y-4">
				<h3 class="text-lg font-bold text-white">Services</h3>
				<ul class="space-y-2">
					<li><a href="/mentions" class="text-gray-300 hover:text-green-400 text-sm">Mentions légales</a></li>
					<li>
						{#if $isAuthenticated}
							<a href="/panier" class="text-gray-300 hover:text-green-400 text-sm">Panier</a>
						{:else}
							<a href="/connexion" class="text-gray-300 hover:text-green-400 text-sm">Panier</a>
						{/if}
					</li>
					<li>
						<a href="/profil" on:click|preventDefault={() => { goto('/profil'); }} class="text-gray-300 hover:text-green-400 text-sm">Profil</a>
					</li>
				</ul>
			</div>

			<!-- À propos -->
			<div class="space-y-4">
				<h3 class="text-lg font-bold text-white">GreenRoots</h3>
				<ul class="space-y-2">
					<li><a href="/apropos" class="text-gray-300 hover:text-green-400 text-sm">À propos</a></li>
				</ul>
			</div>
		</div>

		<!-- Footer Bottom -->
		<div class="border-t border-gray-700 pt-8">
			<div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
				<p class="text-gray-400 text-sm">© 2025 GreenRoots. Tous droits réservés.</p>
				<div class="flex space-x-6 text-sm">
					<a href="/mentions" class="text-gray-400 hover:text-green-400">Politique de confidentialité</a>
					<a href="/mentions" class="text-gray-400 hover:text-green-400">Conditions d'utilisation</a>
				</div>
			</div>
		</div>
	</div>
</footer>
