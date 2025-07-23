<script>
	//@ts-nocheck
    import { setUser, setAuthToken } from '$lib/stores/auth.js';
    import { goto } from '$app/navigation';
    
    let showPassword = false;
    let passwordInput;
    let email = '';
    let password = '';
    let error = '';
    let isLoading = false;

    async function loginSubmit(event) {
        event.preventDefault();
        error = '';
        isLoading = true;       
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });           
            if (!res.ok) {
                const responseData = await res.json();
                error = responseData.error || responseData.message || 'Erreur de connexion';
                return;
            }           
            const data = await res.json();           
            setAuthToken(data.token);           
			await fetchMe(data.token);           
        } catch (err) {
            error = 'Erreur réseau ou serveur';
            console.error(err);
        } finally {
            isLoading = false;
        }      
        password = '';
    }

    async function fetchMe(token) {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                goto('/');
            } else {
                error = 'Échec de récupération des infos utilisateur';
            }
        } catch (err) {
            console.error('Erreur fetch /me', err);
            error = 'Erreur lors de la récupération des données utilisateur';
        }
    }
</script>

<div class="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden flex items-center justify-center">
	<!-- Background decorative elements -->
	<div class="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
	<div class="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
	<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-500"></div>

	<div class="relative z-10 container mx-auto px-4">
		<div class="max-w-md mx-auto">
			<!-- Header -->
			<div class="text-center mb-8">
				<h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
					Connexion
				</h1>
				<p class="text-gray-600">Bienvenue sur GreenRoots</p>
			</div>

			<!-- Login Form -->
			<div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
				<!-- Form Header -->
				<div class="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
					<h2 class="text-xl font-bold text-white flex items-center space-x-3">
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
						</svg>
						<span>Se connecter à votre compte</span>
					</h2>
				</div>

				<!-- Form Content -->
				<form on:submit={loginSubmit} class="p-8 space-y-6">
					<!-- Email -->
					<div class="space-y-2">
						<label for="email" class="block text-sm font-semibold text-gray-700">
							Adresse e-mail
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
									</path>
								</svg>
							</div>
							<input bind:value={email} id="email" type="email" required placeholder="votre@email.com" class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white" disabled={isLoading}/>
						</div>
					</div>

					<!-- Password -->
					<div class="space-y-2">
						<label for="password" class="block text-sm font-semibold text-gray-700">
							Mot de passe
						</label>
						<div class="relative">
							<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
									</path>
								</svg>
							</div>
							<input
								bind:value={password}
								bind:this={passwordInput}
								id="password"
								type={showPassword ? 'text' : 'password'}
								required
								placeholder="Votre mot de passe"
								minlength="8"
								class="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
								disabled={isLoading}
							/>
							<button type="button" class="absolute inset-y-0 right-0 pr-3 flex items-center" on:click={() => (showPassword = !showPassword)} disabled={isLoading}>
								{#if showPassword}
									<svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21">
										</path>
									</svg>
								{:else}
									<svg class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
										</path>
									</svg>
								{/if}
							</button>
						</div>
					</div>

					<!-- Show Password Toggle -->
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-3">
							<input type="checkbox" id="showpassword" bind:checked={showPassword} class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2" disabled={isLoading}/>
							<label for="showpassword" class="text-sm text-gray-600 cursor-pointer">
								Afficher le mot de passe
							</label>
						</div>
						<a href="/forgot-password" class="text-sm text-green-600 hover:text-green-700 underline">
							Mot de passe oublié ?
						</a>
					</div>

					<!-- Error Message -->
					{#if error}
						<div class="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
							<svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							<p class="text-red-700 text-sm">{error}</p>
						</div>
					{/if}

					<!-- Submit Button -->
					<button type="submit" disabled={isLoading}
						class="w-full cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
					>
						{#if isLoading}
							<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span>Connexion en cours...</span>
						{:else}
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
							</svg>
							<span>Se connecter</span>
						{/if}
					</button>

					<!-- Register Link -->
					<div class="text-center pt-4 border-t border-gray-100">
						<p class="text-gray-600 text-sm"> Pas encore de compte ?
							<a href="/inscription" class="text-green-600 hover:text-green-700 font-semibold underline">
								Créer un compte
							</a>
						</p>
					</div>
				</form>
			</div>

			<!-- Social Login (Optional) -->
			<div class="mt-8">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-200"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="px-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 text-gray-500">
							Connexion sécurisée
						</span>
					</div>
				</div>

				<div class="mt-6 flex justify-center space-x-6 text-sm text-gray-500">
					<div class="flex items-center space-x-2">
						<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.012-3.47A.75.75 0 0121 8.25V15a6 6 0 01-6 6H9a6 6 0 01-6-6V8.25c0-.621.504-1.125 1.125-1.125H8.25"></path>
						</svg>
						<span>Données chiffrées</span>
					</div>
					<div class="flex items-center space-x-2">
						<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
						</svg>
						<span>Protection RGPD</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>