<script>
	import logo from '$lib/../public/Logo-GR.R.png';
	import { isAuthenticated, user, clearAuth } from '$lib/stores/auth.js';
	import { tree } from '$lib/stores/tree';
	import { CartPreview, UserMenu } from '$lib/components';

	let mobileMenuOpen = false;

	$: totalItems = $tree.reduce((sum, item) => sum + item.quantity, 0);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	const navLinks = [
		{ href: '/', label: 'Accueil' },
		{ href: '/produits', label: 'Boutique' },
		{ href: '/contact', label: 'Contact' },
		{ href: '/apropos', label: 'À propos' }
	];
</script>

<nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg">
	<div class="container mx-auto px-4 max-w-[85rem]">
		<div class="flex items-center justify-between h-20">
			
			<!-- Logo -->
			<a href="/" class="flex items-center space-x-2 group">
				<img src={logo} alt="GreenRoots Logo" class="w-12 h-12 transition-transform duration-300 group-hover:scale-105" />
				<span class="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent hidden sm:block">
					GreenRoots
				</span>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden lg:flex items-center space-x-8">
				{#each navLinks as { href, label }}
					<a href={href} class="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300 relative group">
						{label}
						<span class="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
					</a>
				{/each}
			</div>

			<!-- Right Side -->
			<div class="flex items-center space-x-4">
				{#if $isAuthenticated}
					<CartPreview {totalItems} />
					<UserMenu {user} />
				{:else}
					<div class="hidden md:flex items-center space-x-3">
						<a href="/connexion" class="px-4 py-2 text-gray-700 hover:text-green-600 font-medium">Se connecter</a>
						<a href="/inscription" class="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl">S'inscrire</a>
					</div>
				{/if}

				<!-- Mobile Menu Button -->
				<button on:click={toggleMobileMenu} class="lg:hidden p-2 text-gray-700 hover:text-green-600 transition-colors duration-300">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						{#if mobileMenuOpen}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
						{:else}
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
						{/if}
					</svg>
				</button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="lg:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200 py-4">
				{#each navLinks as { href, label }}
					<a href={href} on:click={() => mobileMenuOpen = false} class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl">
						{label}
					</a>
				{/each}
				{#if !$isAuthenticated}
					<div class="border-t border-gray-200 pt-4 space-y-2">
						<a href="/connexion" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl">Se connecter</a>
						<a href="/inscription" class="block px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-center">
							S'inscrire
						</a>
					</div>
				{:else}
					<div class="border-t border-gray-200 pt-4 space-y-2">
						<a href="/panier" class="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl flex justify-between items-center">
							<span>Panier</span>
							{#if totalItems > 0}
								<span class="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{totalItems}</span>
							{/if}
						</a>
						<a href="/profil" class="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl">Mon profil</a>
						<button on:click={() => { clearAuth(); mobileMenuOpen = false; }} class="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl">Se déconnecter</button>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</nav>
