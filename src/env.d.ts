/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import type { User } from '@db/queries/types';

// declare namespace App {
// 	interface Locals {
// 		Name: string;
// 	}
// }

declare global {
	declare namespace App {
		// eslint-disable-next-line  @typescript-eslint/no-empty-interface
		interface Locals {
			user: User;
		}
	}
}
