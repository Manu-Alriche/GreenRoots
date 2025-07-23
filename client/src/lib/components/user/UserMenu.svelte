<script>
	import { clearAuth } from '$lib/stores/auth.js';
	import { goto } from '$app/navigation';
	export let user;

	function logout() {
		clearAuth();
		window.location.href = '/';
	}
</script>

<div class="relative group">
	<button class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition" on:click|preventDefault={() => goto('/profil')}>
		<div class="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
			<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
			</svg>
		</div>
		<span class="hidden md:block text-sm font-medium text-gray-700">{$user?.firstName || 'Mon compte'}</span>
	</button>

	<!-- Dropdown -->
	<div class="absolute right-0 top-full mt-2 w-48 bg-white/95 rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
		<div class="py-2">
			<a href="/profil" on:click|preventDefault={() => goto('/profil')} class="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 cursor-pointer">Mon profil</a>
			<button on:click={logout} class="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer">Se déconnecter</button>
		</div>
	</div>
</div>
