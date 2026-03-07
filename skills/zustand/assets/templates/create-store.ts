/**
 * Factory for Zustand stores with immer + subscribeWithSelector, and optional persist.
 *
 * Middleware order (innermost first): immer → subscribeWithSelector → [persist when opts given].
 * See skill: skills/zustand/SKILL.md — "Combining Middleware", "Immer", "Persist", "TypeScript".
 *
 * Usage:
 * - createStore(name, initialState, actions) → store without persist
 * - createStore(name, initialState, actions, { name, storage?, partialize? }) → persisted store
 * Use partialize when the store has non-serializable values (e.g. functions). See SKILL.md "Anti-patterns".
 */
import { enableMapSet } from 'immer';
import {
	type Mutate,
	type StateCreator,
	type StoreApi,
	type UseBoundStore,
	create as zustandCreate,
} from 'zustand';
import {
	type PersistOptions,
	persist,
	subscribeWithSelector,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

enableMapSet();

type Actions<T extends object, U extends object> = StateCreator<
	T & U,
	[
		['zustand/persist', never],
		['zustand/subscribeWithSelector', never],
		['zustand/immer', never],
	],
	[
		['zustand/immer', never],
		['zustand/subscribeWithSelector', never],
		['zustand/persist', never],
	],
	U
>;
export type PersistStore<T extends object, U extends object> = UseBoundStore<
	Mutate<
		StoreApi<T & U>,
		[
			['zustand/persist', never],
			['zustand/subscribeWithSelector', never],
			['zustand/immer', never],
		]
	>
>;

export type Store<T extends object, U extends object> = UseBoundStore<
	Mutate<
		StoreApi<T & U>,
		[['zustand/immer', never], ['zustand/subscribeWithSelector', never]]
	>
>;

export function createStore<T extends object, U extends object>(
	name: string,
	state: T,
	actions: Actions<T, U>,
): Store<T, U>;
export function createStore<T extends object, U extends object>(
	name: string,
	state: T,
	actions: Actions<T, U>,
	persistOptions: Partial<PersistOptions<T & U, Partial<T>>>,
): PersistStore<T, U>;
export function createStore<
	T extends object,
	U extends object,
	PersistOpts = Partial<PersistOptions<T & U, Partial<T>>> | undefined,
>(
	name: string,
	state: T,
	actions: Actions<T, U>,
	persistOptions?: PersistOpts,
) {
	if (persistOptions) {
		// persist wraps outer; pass partialize in persistOptions to exclude non-serializable state (see SKILL.md)
		return zustandCreate<T & U>()(
			persist(
				subscribeWithSelector(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					immer((...a) => Object.assign({}, state, (actions as any)(...a))),
				),
				{ ...persistOptions, name },
			),
		);
	}
	return zustandCreate<T & U>()(
		subscribeWithSelector(
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			immer((...a) => Object.assign({}, state, (actions as any)(...a))),
		),
	);
}