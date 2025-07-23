<script>
	import { tree } from '$lib/stores/tree';

	export let totalItems;

	$: totalPrice = $tree.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
</script>

<div class="relative group">
	<a href="/panier" class="relative p-2 text-gray-700 hover:text-green-600 transition-colors duration-300 block">
		<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8a2 2 0 104 0 2 2 0 00-4 0zm10 0a2 2 0 104 0 2 2 0 00-4 0z"/>
		</svg>
		{#if totalItems > 0}
			<span class="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{totalItems}</span>
		{/if}
	</a>

	<!-- Dropdown -->
	<div class="absolute right-0 top-full w-80 bg-white/95 rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
		<div class="p-6">
			<h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
				<span>Votre panier</span>
			</h3>
			<div class="space-y-3 mb-4">
				<div class="text-sm text-gray-600">{totalItems} article{totalItems > 1 ? 's' : ''}</div>
				<div class="text-xl font-bold text-green-600">Total : {totalPrice}€</div>
			</div>
			<a href="/panier" class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 block text-center">
				Voir le panier
			</a>
		</div>
	</div>
</div>
