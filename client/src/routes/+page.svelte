<script>
	import { HeroSection, HistorySection , BestSellers } from '$lib/components';
	import { user } from '$lib/stores/auth';
	export let data;

	const trees = data.tree;
	$: isAdmin = $user?.role.id === 1;
</script>

<HeroSection />

<HistorySection />

<BestSellers {trees} {isAdmin} />