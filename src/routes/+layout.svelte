<script>
	import { Button } from '$lib/components/ui/button';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ModeWatcher, toggleMode } from 'mode-watcher';
	import { Github, Moon, Sun, User } from 'lucide-svelte';
	import '../app.pcss';
</script>

<ModeWatcher disableTransitions={false} />

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container max-w-6xl pl-4 pr-4">
		<div class="flex h-[70px] items-center justify-between gap-3">
			<div class="flex items-center gap-1.5">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root>
							<Avatar.Image src="favicon.png" alt="chadmaths" />
							<Avatar.Fallback>CM</Avatar.Fallback>
						</Avatar.Root>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>
								<a href="/" class="hover:underline" data-sveltekit-reload>chadmaths</a>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item href="https://github.com/nwrenger/chadmaths" target="_blank">
								<Github class="mr-2 h-4 w-4" />
								<span>Github</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item href="https://github.com/nwrenger" target="_blank">
								<User class="mr-2 h-4 w-4" />
								<span>Profile</span>
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<div class="flex items-center justify-end gap-2.5">
				<Button on:click={toggleMode} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</div>
</header>

<div class="container mx-auto flex max-w-6xl flex-col items-center space-y-8 p-4">
	<slot />
</div>
