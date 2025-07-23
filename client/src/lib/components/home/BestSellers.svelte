<script>
	import ProductCard from '$lib/components/product/ProductCard.svelte';
	export let trees = [];
	export let isAdmin = false;
</script>

<section class="relative -mx-4 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 overflow-hidden py-16">
	<!-- Background -->
	<div class="absolute inset-0 opacity-10 bg-repeat" style="background-image: url('data:image/svg+xml,<svg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><g fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;><g fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.1&quot;><circle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/></g></g></svg>');"></div>
	<div class="absolute top-20 right-20 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-48 h-48 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

	<div class="relative z-10 container mx-auto px-4">
		<!-- Header -->
		<div class="text-center mb-16">
			<h2 class="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Best Sellers</h2>
			<p class="text-xl text-white/90 drop-shadow-md">Top 3 produits</p>
			<div class="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mt-6 rounded-full"></div>
		</div>

		<!-- Products -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#if trees.length > 0}
                {#each trees.slice(0, 3) as tree, index}
                    <ProductCard {tree} {isAdmin} {index} />
                {/each}
            {:else}
                <!-- Message d'absence de produit -->
            {/if}
        </div>
	</div>
</section>
