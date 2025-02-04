
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately after the component has been updated.
     *
     * The first time the callback runs will be after the initial `onMount`
     */
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function construct_svelte_component_dev(component, props) {
        const error_message = 'this={...} of <svelte:component> should specify a Svelte component.';
        try {
            const instance = new component(props);
            if (!instance.$$ || !instance.$set || !instance.$on || !instance.$destroy) {
                throw new Error(error_message);
            }
            return instance;
        }
        catch (err) {
            const { message } = err;
            if (typeof message === 'string' && message.indexOf('is not a constructor') !== -1) {
                throw new Error(error_message);
            }
            else {
                throw err;
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    function parse(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (246:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(246:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (239:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) mount_component(switch_instance, target, anchor);
    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (dirty & /*component*/ 1 && switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = construct_svelte_component_dev(switch_value, switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(239:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc, _loc => _loc.location);
    const querystring = derived(loc, _loc => _loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    function restoreScroll(state) {
    	// If this exists, then this is a back navigation: restore the scroll position
    	if (state) {
    		window.scrollTo(state.__svelte_spa_router_scrollX, state.__svelte_spa_router_scrollY);
    	} else {
    		// Otherwise this is a forward navigation: scroll to top
    		window.scrollTo(0, 0);
    	}
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && (event.state.__svelte_spa_router_scrollY || event.state.__svelte_spa_router_scrollX)) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			restoreScroll(previousScrollState);
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link,
    		restoreScroll,
    		updateLink,
    		linkOpts,
    		scrollstateHistoryHandler,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Navbar.svelte generated by Svelte v3.59.2 */
    const file$6 = "src\\components\\Navbar.svelte";

    function create_fragment$7(ctx) {
    	let header;
    	let div2;
    	let div1;
    	let a0;
    	let img;
    	let img_src_value;
    	let t0;
    	let i0;
    	let t1;
    	let ul;
    	let li0;
    	let a1;
    	let t2;
    	let a1_class_value;
    	let t3;
    	let li1;
    	let a2;
    	let t4;
    	let a2_class_value;
    	let t5;
    	let li2;
    	let a3;
    	let t6;
    	let a3_class_value;
    	let t7;
    	let li3;
    	let a4;
    	let t8;
    	let a4_class_value;
    	let t9;
    	let div0;
    	let i1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div2 = element("div");
    			div1 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			i0 = element("i");
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			t2 = text("Home");
    			t3 = space();
    			li1 = element("li");
    			a2 = element("a");
    			t4 = text("About");
    			t5 = space();
    			li2 = element("li");
    			a3 = element("a");
    			t6 = text("Projects");
    			t7 = space();
    			li3 = element("li");
    			a4 = element("a");
    			t8 = text("Contact");
    			t9 = space();
    			div0 = element("div");
    			i1 = element("i");
    			if (!src_url_equal(img.src, img_src_value = "/assets/signaturecropped.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "signature svelte-1m4ydzg");
    			add_location(img, file$6, 21, 16, 518);
    			attr_dev(i0, "class", "fa fa-bolt svelte-1m4ydzg");
    			add_location(i0, file$6, 26, 16, 687);
    			attr_dev(a0, "href", "/home");
    			attr_dev(a0, "class", "logo svelte-1m4ydzg");
    			add_location(a0, file$6, 20, 12, 462);
    			attr_dev(a1, "href", "/home");
    			attr_dev(a1, "class", a1_class_value = "" + (null_to_empty(/*activePage*/ ctx[0] === "/home" ? "active" : "") + " svelte-1m4ydzg"));
    			add_location(a1, file$6, 30, 20, 808);
    			attr_dev(li0, "class", "svelte-1m4ydzg");
    			add_location(li0, file$6, 29, 16, 782);
    			attr_dev(a2, "href", "/about");
    			attr_dev(a2, "class", a2_class_value = "" + (null_to_empty(/*activePage*/ ctx[0] === "/about" ? "active" : "") + " svelte-1m4ydzg"));
    			add_location(a2, file$6, 38, 20, 1117);
    			attr_dev(li1, "class", "svelte-1m4ydzg");
    			add_location(li1, file$6, 37, 16, 1091);
    			attr_dev(a3, "href", "/projects");
    			attr_dev(a3, "class", a3_class_value = "" + (null_to_empty(/*activePage*/ ctx[0] === "/projects" ? "active" : "") + " svelte-1m4ydzg"));
    			add_location(a3, file$6, 46, 20, 1430);
    			attr_dev(li2, "class", "svelte-1m4ydzg");
    			add_location(li2, file$6, 45, 16, 1404);
    			attr_dev(a4, "href", "/contact");
    			attr_dev(a4, "class", a4_class_value = "" + (null_to_empty(/*activePage*/ ctx[0] === "/contact" ? "active" : "") + " svelte-1m4ydzg"));
    			add_location(a4, file$6, 54, 20, 1755);
    			attr_dev(li3, "class", "svelte-1m4ydzg");
    			add_location(li3, file$6, 53, 16, 1729);
    			attr_dev(ul, "class", "navbar svelte-1m4ydzg");
    			add_location(ul, file$6, 28, 12, 745);
    			attr_dev(i1, "class", "fa fa-bars svelte-1m4ydzg");
    			add_location(i1, file$6, 63, 16, 2106);
    			attr_dev(div0, "class", "menu_icon svelte-1m4ydzg");
    			add_location(div0, file$6, 62, 12, 2065);
    			attr_dev(div1, "class", "header svelte-1m4ydzg");
    			add_location(div1, file$6, 19, 8, 428);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file$6, 18, 4, 395);
    			attr_dev(header, "class", "header-area svelte-1m4ydzg");
    			add_location(header, file$6, 17, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div2);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(a0, img);
    			append_dev(a0, t0);
    			append_dev(a0, i0);
    			append_dev(div1, t1);
    			append_dev(div1, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(a1, t2);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(a2, t4);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(a3, t6);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(a4, t8);
    			append_dev(div1, t9);
    			append_dev(div1, div0);
    			append_dev(div0, i1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(link.call(null, a0)),
    					action_destroyer(link.call(null, a1)),
    					listen_dev(a1, "click", /*click_handler*/ ctx[2], false, false, false, false),
    					action_destroyer(link.call(null, a2)),
    					listen_dev(a2, "click", /*click_handler_1*/ ctx[3], false, false, false, false),
    					action_destroyer(link.call(null, a3)),
    					listen_dev(a3, "click", /*click_handler_2*/ ctx[4], false, false, false, false),
    					action_destroyer(link.call(null, a4)),
    					listen_dev(a4, "click", /*click_handler_3*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activePage*/ 1 && a1_class_value !== (a1_class_value = "" + (null_to_empty(/*activePage*/ ctx[0] === "/home" ? "active" : "") + " svelte-1m4ydzg"))) {
    				attr_dev(a1, "class", a1_class_value);
    			}

    			if (dirty & /*activePage*/ 1 && a2_class_value !== (a2_class_value = "" + (null_to_empty(/*activePage*/ ctx[0] === "/about" ? "active" : "") + " svelte-1m4ydzg"))) {
    				attr_dev(a2, "class", a2_class_value);
    			}

    			if (dirty & /*activePage*/ 1 && a3_class_value !== (a3_class_value = "" + (null_to_empty(/*activePage*/ ctx[0] === "/projects" ? "active" : "") + " svelte-1m4ydzg"))) {
    				attr_dev(a3, "class", a3_class_value);
    			}

    			if (dirty & /*activePage*/ 1 && a4_class_value !== (a4_class_value = "" + (null_to_empty(/*activePage*/ ctx[0] === "/contact" ? "active" : "") + " svelte-1m4ydzg"))) {
    				attr_dev(a4, "class", a4_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let activePage = "/home";

    	onMount(() => {
    		if (window.location.pathname !== "#/home") {
    			window.location.replace("#/home");
    		}
    	});

    	function setActivePage(page) {
    		$$invalidate(0, activePage = page);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => setActivePage("/home");
    	const click_handler_1 = () => setActivePage("/about");
    	const click_handler_2 = () => setActivePage("/projects");
    	const click_handler_3 = () => setActivePage("/contact");
    	$$self.$capture_state = () => ({ onMount, link, activePage, setActivePage });

    	$$self.$inject_state = $$props => {
    		if ('activePage' in $$props) $$invalidate(0, activePage = $$props.activePage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		activePage,
    		setActivePage,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\pages\Home.svelte generated by Svelte v3.59.2 */

    const file$5 = "src\\pages\\Home.svelte";

    function create_fragment$6(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div3;
    	let h1;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let p;
    	let br2;
    	let t5;
    	let t6;
    	let div1;
    	let a0;
    	let t8;
    	let a1;
    	let t10;
    	let div2;
    	let a2;
    	let i0;
    	let t11;
    	let a3;
    	let i1;
    	let t12;
    	let a4;
    	let i2;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div3 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Hi I'm Ragu";
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			br1 = element("br");
    			t4 = space();
    			p = element("p");
    			br2 = element("br");
    			t5 = text("An enthusiastic Data Analyst, with a strong passion for\r\n                uncovering meaningful insights through the application of data\r\n                science techniques.");
    			t6 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "Download CV";
    			t8 = space();
    			a1 = element("a");
    			a1.textContent = "Contact";
    			t10 = space();
    			div2 = element("div");
    			a2 = element("a");
    			i0 = element("i");
    			t11 = space();
    			a3 = element("a");
    			i1 = element("i");
    			t12 = space();
    			a4 = element("a");
    			i2 = element("i");
    			if (!src_url_equal(img.src, img_src_value = "./assets/photo!!.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-d493od");
    			add_location(img, file$5, 6, 12, 128);
    			attr_dev(div0, "class", "profile-photo svelte-d493od");
    			add_location(div0, file$5, 5, 8, 87);
    			attr_dev(h1, "class", "svelte-d493od");
    			add_location(h1, file$5, 9, 12, 235);
    			add_location(br0, file$5, 10, 12, 269);
    			add_location(br1, file$5, 10, 19, 276);
    			add_location(br2, file$5, 12, 16, 317);
    			attr_dev(p, "class", "svelte-d493od");
    			add_location(p, file$5, 11, 12, 296);
    			attr_dev(a0, "href", "./assets/Resume.pdf");
    			attr_dev(a0, "class", "btn active svelte-d493od");
    			add_location(a0, file$5, 18, 16, 570);
    			attr_dev(a1, "href", "mailto:https.ragu@gmail.com");
    			attr_dev(a1, "class", "btn svelte-d493od");
    			add_location(a1, file$5, 19, 16, 652);
    			attr_dev(div1, "class", "btn-group svelte-d493od");
    			add_location(div1, file$5, 17, 12, 529);
    			attr_dev(i0, "class", "fa fa-envelope svelte-d493od");
    			add_location(i0, file$5, 24, 21, 847);
    			attr_dev(a2, "href", "mailto:https.ragu@gmail.com");
    			add_location(a2, file$5, 23, 16, 787);
    			attr_dev(i1, "class", "fa-brands fa-github svelte-d493od");
    			add_location(i1, file$5, 27, 21, 974);
    			attr_dev(a3, "href", "https://github.com/ragu8");
    			add_location(a3, file$5, 26, 16, 917);
    			attr_dev(i2, "class", "fa-brands fa-linkedin svelte-d493od");
    			add_location(i2, file$5, 30, 21, 1116);
    			attr_dev(a4, "href", "https://www.linkedin.com/in/ragu8/");
    			add_location(a4, file$5, 29, 16, 1049);
    			attr_dev(div2, "class", "social");
    			add_location(div2, file$5, 22, 12, 749);
    			attr_dev(div3, "class", "profile-text svelte-d493od");
    			add_location(div3, file$5, 8, 8, 195);
    			attr_dev(div4, "class", "HomeElement svelte-d493od");
    			add_location(div4, file$5, 4, 4, 52);
    			attr_dev(div5, "class", "container");
    			add_location(div5, file$5, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div0, img);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, h1);
    			append_dev(div3, t2);
    			append_dev(div3, br0);
    			append_dev(div3, t3);
    			append_dev(div3, br1);
    			append_dev(div3, t4);
    			append_dev(div3, p);
    			append_dev(p, br2);
    			append_dev(p, t5);
    			append_dev(div3, t6);
    			append_dev(div3, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t8);
    			append_dev(div1, a1);
    			append_dev(div3, t10);
    			append_dev(div3, div2);
    			append_dev(div2, a2);
    			append_dev(a2, i0);
    			append_dev(div2, t11);
    			append_dev(div2, a3);
    			append_dev(a3, i1);
    			append_dev(div2, t12);
    			append_dev(div2, a4);
    			append_dev(a4, i2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\pages\About.svelte generated by Svelte v3.59.2 */

    const file$4 = "src\\pages\\About.svelte";

    function create_fragment$5(ctx) {
    	let section0;
    	let div3;
    	let div2;
    	let div0;
    	let h40;
    	let t1;
    	let ul0;
    	let li0;
    	let t3;
    	let li1;
    	let t5;
    	let li2;
    	let t7;
    	let div1;
    	let ul1;
    	let li3;
    	let t9;
    	let li4;
    	let t11;
    	let li5;
    	let t13;
    	let li6;
    	let t15;
    	let li7;
    	let t16;
    	let a0;
    	let t18;
    	let li8;
    	let t19;
    	let a1;
    	let t21;
    	let li9;
    	let t22;
    	let a2;
    	let t24;
    	let li10;
    	let t26;
    	let section1;
    	let div19;
    	let div18;
    	let div11;
    	let h30;
    	let t28;
    	let div10;
    	let div9;
    	let div8;
    	let div5;
    	let div4;
    	let t29;
    	let h31;
    	let t31;
    	let h41;
    	let t33;
    	let h42;
    	let t35;
    	let h43;
    	let i0;
    	let t36;
    	let t37;
    	let div7;
    	let div6;
    	let t38;
    	let h32;
    	let t40;
    	let h44;
    	let t42;
    	let h45;
    	let t44;
    	let h46;
    	let i1;
    	let t45;
    	let t46;
    	let div17;
    	let h33;
    	let t48;
    	let div16;
    	let div15;
    	let div14;
    	let div13;
    	let div12;
    	let t49;
    	let h34;
    	let t51;
    	let h47;
    	let t53;
    	let h48;
    	let i2;
    	let t54;
    	let t55;
    	let li11;

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h40 = element("h4");
    			h40.textContent = "About Me";
    			t1 = space();
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Extensive experience in developing and deploying machine\r\n                        learning models, addressing a wide range of business\r\n                        challenges.";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "Key contributor to a successful Proof-Of-Concept for\r\n                        FinRL at Galaxy Technology Services.";
    			t5 = space();
    			li2 = element("li");
    			li2.textContent = "Committed to continuous learning, staying updated with\r\n                        the latest advancements in Data Science, and expanding\r\n                        knowledge and skill sets";
    			t7 = space();
    			div1 = element("div");
    			ul1 = element("ul");
    			li3 = element("li");
    			li3.textContent = "👤 Name: Ragupathi M";
    			t9 = space();
    			li4 = element("li");
    			li4.textContent = "🎂 Age: 22";
    			t11 = space();
    			li5 = element("li");
    			li5.textContent = "🌍 From: Hosur 🇮🇳";
    			t13 = space();
    			li6 = element("li");
    			li6.textContent = "📧 Email: https.ragu@gmail.com";
    			t15 = space();
    			li7 = element("li");
    			t16 = text("💼 Github: ");
    			a0 = element("a");
    			a0.textContent = "https://github.com/ragu8";
    			t18 = space();
    			li8 = element("li");
    			t19 = text("📊 Kaggle: ");
    			a1 = element("a");
    			a1.textContent = "https://www.kaggle.com/ragu08";
    			t21 = space();
    			li9 = element("li");
    			t22 = text("🔗 LinkedIn: ");
    			a2 = element("a");
    			a2.textContent = "https://www.linkedin.com/ragu8";
    			t24 = space();
    			li10 = element("li");
    			li10.textContent = "⌛ Experience: 1yr";
    			t26 = space();
    			section1 = element("section");
    			div19 = element("div");
    			div18 = element("div");
    			div11 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Education";
    			t28 = space();
    			div10 = element("div");
    			div9 = element("div");
    			div8 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			t29 = space();
    			h31 = element("h3");
    			h31.textContent = "M.E Operations Research";
    			t31 = space();
    			h41 = element("h4");
    			h41.textContent = "Ramanujan Computing Center";
    			t33 = space();
    			h42 = element("h4");
    			h42.textContent = "Anna University";
    			t35 = space();
    			h43 = element("h4");
    			i0 = element("i");
    			t36 = text(" 2023-2025");
    			t37 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t38 = space();
    			h32 = element("h3");
    			h32.textContent = "B.E Data Science - 91%";
    			t40 = space();
    			h44 = element("h4");
    			h44.textContent = "Faculty of Engineering & Technology";
    			t42 = space();
    			h45 = element("h4");
    			h45.textContent = "Annamalai University";
    			t44 = space();
    			h46 = element("h4");
    			i1 = element("i");
    			t45 = text(" 2019-2023");
    			t46 = space();
    			div17 = element("div");
    			h33 = element("h3");
    			h33.textContent = "Experience";
    			t48 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			t49 = space();
    			h34 = element("h3");
    			h34.textContent = "Data Analyst Intern";
    			t51 = space();
    			h47 = element("h4");
    			h47.textContent = "Galaxy Technology Services";
    			t53 = space();
    			h48 = element("h4");
    			i2 = element("i");
    			t54 = text(" September 2022\r\n                                    - May 2023 | Internship | Remote");
    			t55 = space();
    			li11 = element("li");
    			li11.textContent = "Data Analyst specializing in deploying\r\n                                    machine learning models for diverse business\r\n                                    challenges, leveraging Quantum computing for\r\n                                    stock price predictions with an impressive\r\n                                    89% accuracy. Key contributor to a\r\n                                    Proof-Of-Concept for stock prediction using\r\n                                    Quantum computing at Galaxy Technology\r\n                                    Services. Demonstrates expertise in advanced\r\n                                    technologies, collaborative problem-solving,\r\n                                    and strategic decision-making. Analytical\r\n                                    with a keen eye for identifying patterns,\r\n                                    committed to continuous learning and\r\n                                    contributing to organizational success.";
    			attr_dev(h40, "class", "svelte-d4zl3e");
    			add_location(h40, file$4, 7, 16, 179);
    			attr_dev(li0, "class", "svelte-d4zl3e");
    			add_location(li0, file$4, 9, 20, 240);
    			attr_dev(li1, "class", "svelte-d4zl3e");
    			add_location(li1, file$4, 14, 20, 490);
    			attr_dev(li2, "class", "svelte-d4zl3e");
    			add_location(li2, file$4, 18, 20, 683);
    			attr_dev(ul0, "class", "svelte-d4zl3e");
    			add_location(ul0, file$4, 8, 16, 214);
    			attr_dev(div0, "class", "about-content svelte-d4zl3e");
    			add_location(div0, file$4, 6, 12, 134);
    			attr_dev(li3, "class", "svelte-d4zl3e");
    			add_location(li3, file$4, 28, 20, 1053);
    			attr_dev(li4, "class", "svelte-d4zl3e");
    			add_location(li4, file$4, 29, 20, 1104);
    			attr_dev(li5, "class", "svelte-d4zl3e");
    			add_location(li5, file$4, 30, 20, 1145);
    			attr_dev(li6, "class", "svelte-d4zl3e");
    			add_location(li6, file$4, 31, 20, 1195);
    			attr_dev(a0, "href", "https://github.com/ragu8");
    			add_location(a0, file$4, 33, 35, 1297);
    			attr_dev(li7, "class", "svelte-d4zl3e");
    			add_location(li7, file$4, 32, 20, 1256);
    			attr_dev(a1, "href", "https://www.kaggle.com/ragu08");
    			add_location(a1, file$4, 38, 35, 1506);
    			attr_dev(li8, "class", "svelte-d4zl3e");
    			add_location(li8, file$4, 37, 20, 1465);
    			attr_dev(a2, "href", "https://www.linkedin.com/in/ragu8/");
    			add_location(a2, file$4, 43, 37, 1727);
    			attr_dev(li9, "class", "svelte-d4zl3e");
    			add_location(li9, file$4, 42, 20, 1684);
    			attr_dev(li10, "class", "svelte-d4zl3e");
    			add_location(li10, file$4, 48, 20, 1940);
    			attr_dev(ul1, "class", "svelte-d4zl3e");
    			add_location(ul1, file$4, 27, 16, 1027);
    			attr_dev(div1, "class", "about-skills svelte-d4zl3e");
    			add_location(div1, file$4, 26, 12, 983);
    			attr_dev(div2, "class", "about svelte-d4zl3e");
    			add_location(div2, file$4, 5, 8, 101);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$4, 4, 4, 68);
    			attr_dev(section0, "class", "about-area svelte-d4zl3e");
    			attr_dev(section0, "id", "about");
    			add_location(section0, file$4, 3, 0, 23);
    			attr_dev(h30, "class", "title svelte-d4zl3e");
    			add_location(h30, file$4, 60, 16, 2255);
    			attr_dev(div4, "class", "circle-dot svelte-d4zl3e");
    			add_location(div4, file$4, 66, 32, 2561);
    			attr_dev(h31, "class", "timeline-title svelte-d4zl3e");
    			add_location(h31, file$4, 67, 32, 2625);
    			attr_dev(h41, "class", "timeline-title svelte-d4zl3e");
    			add_location(h41, file$4, 70, 32, 2786);
    			attr_dev(h42, "class", "timeline-title svelte-d4zl3e");
    			add_location(h42, file$4, 73, 32, 2950);
    			attr_dev(i0, "class", "fa fa-calendar");
    			add_location(i0, file$4, 75, 36, 3096);
    			attr_dev(h43, "class", "timeline-title svelte-d4zl3e");
    			add_location(h43, file$4, 74, 32, 3031);
    			attr_dev(div5, "class", "timeline-item svelte-d4zl3e");
    			add_location(div5, file$4, 65, 28, 2500);
    			attr_dev(div6, "class", "circle-dot svelte-d4zl3e");
    			add_location(div6, file$4, 81, 32, 3356);
    			attr_dev(h32, "class", "timeline-title svelte-d4zl3e");
    			add_location(h32, file$4, 82, 32, 3420);
    			attr_dev(h44, "class", "timeline-title svelte-d4zl3e");
    			add_location(h44, file$4, 85, 32, 3580);
    			attr_dev(h45, "class", "timeline-title svelte-d4zl3e");
    			add_location(h45, file$4, 88, 32, 3753);
    			attr_dev(i1, "class", "fa fa-calendar");
    			add_location(i1, file$4, 92, 36, 3976);
    			attr_dev(h46, "class", "timeline-title svelte-d4zl3e");
    			add_location(h46, file$4, 91, 32, 3911);
    			attr_dev(div7, "class", "timeline-item svelte-d4zl3e");
    			add_location(div7, file$4, 80, 28, 3295);
    			attr_dev(div8, "class", "timeline svelte-d4zl3e");
    			add_location(div8, file$4, 63, 24, 2396);
    			attr_dev(div9, "class", "timeline-box");
    			add_location(div9, file$4, 62, 20, 2344);
    			attr_dev(div10, "class", "row svelte-d4zl3e");
    			add_location(div10, file$4, 61, 16, 2305);
    			attr_dev(div11, "class", "education svelte-d4zl3e");
    			add_location(div11, file$4, 59, 12, 2214);
    			attr_dev(h33, "class", "title svelte-d4zl3e");
    			add_location(h33, file$4, 101, 16, 4253);
    			attr_dev(div12, "class", "circle-dot svelte-d4zl3e");
    			add_location(div12, file$4, 106, 32, 4508);
    			attr_dev(h34, "class", "timeline-title svelte-d4zl3e");
    			add_location(h34, file$4, 107, 32, 4572);
    			attr_dev(h47, "class", "timeline-title svelte-d4zl3e");
    			add_location(h47, file$4, 110, 32, 4729);
    			attr_dev(i2, "class", "fa fa-calendar");
    			add_location(i2, file$4, 114, 36, 4958);
    			attr_dev(h48, "class", "timeline-title svelte-d4zl3e");
    			add_location(h48, file$4, 113, 32, 4893);
    			attr_dev(li11, "class", "timeline-text svelte-d4zl3e");
    			add_location(li11, file$4, 117, 32, 5146);
    			attr_dev(div13, "class", "timeline-item svelte-d4zl3e");
    			add_location(div13, file$4, 105, 28, 4447);
    			attr_dev(div14, "class", "timeline svelte-d4zl3e");
    			add_location(div14, file$4, 104, 24, 4395);
    			attr_dev(div15, "class", "timeline-box");
    			add_location(div15, file$4, 103, 20, 4343);
    			attr_dev(div16, "class", "row svelte-d4zl3e");
    			add_location(div16, file$4, 102, 16, 4304);
    			attr_dev(div17, "class", "internship svelte-d4zl3e");
    			add_location(div17, file$4, 100, 12, 4211);
    			attr_dev(div18, "class", "row svelte-d4zl3e");
    			add_location(div18, file$4, 58, 8, 2183);
    			attr_dev(div19, "class", "container");
    			add_location(div19, file$4, 57, 4, 2150);
    			attr_dev(section1, "class", "education-content svelte-d4zl3e");
    			attr_dev(section1, "id", "education");
    			add_location(section1, file$4, 56, 0, 2094);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			append_dev(section0, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h40);
    			append_dev(div0, t1);
    			append_dev(div0, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t3);
    			append_dev(ul0, li1);
    			append_dev(ul0, t5);
    			append_dev(ul0, li2);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, ul1);
    			append_dev(ul1, li3);
    			append_dev(ul1, t9);
    			append_dev(ul1, li4);
    			append_dev(ul1, t11);
    			append_dev(ul1, li5);
    			append_dev(ul1, t13);
    			append_dev(ul1, li6);
    			append_dev(ul1, t15);
    			append_dev(ul1, li7);
    			append_dev(li7, t16);
    			append_dev(li7, a0);
    			append_dev(ul1, t18);
    			append_dev(ul1, li8);
    			append_dev(li8, t19);
    			append_dev(li8, a1);
    			append_dev(ul1, t21);
    			append_dev(ul1, li9);
    			append_dev(li9, t22);
    			append_dev(li9, a2);
    			append_dev(ul1, t24);
    			append_dev(ul1, li10);
    			insert_dev(target, t26, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div19);
    			append_dev(div19, div18);
    			append_dev(div18, div11);
    			append_dev(div11, h30);
    			append_dev(div11, t28);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div5);
    			append_dev(div5, div4);
    			append_dev(div5, t29);
    			append_dev(div5, h31);
    			append_dev(div5, t31);
    			append_dev(div5, h41);
    			append_dev(div5, t33);
    			append_dev(div5, h42);
    			append_dev(div5, t35);
    			append_dev(div5, h43);
    			append_dev(h43, i0);
    			append_dev(h43, t36);
    			append_dev(div8, t37);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div7, t38);
    			append_dev(div7, h32);
    			append_dev(div7, t40);
    			append_dev(div7, h44);
    			append_dev(div7, t42);
    			append_dev(div7, h45);
    			append_dev(div7, t44);
    			append_dev(div7, h46);
    			append_dev(h46, i1);
    			append_dev(h46, t45);
    			append_dev(div18, t46);
    			append_dev(div18, div17);
    			append_dev(div17, h33);
    			append_dev(div17, t48);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div13, t49);
    			append_dev(div13, h34);
    			append_dev(div13, t51);
    			append_dev(div13, h47);
    			append_dev(div13, t53);
    			append_dev(div13, h48);
    			append_dev(h48, i2);
    			append_dev(h48, t54);
    			append_dev(div13, t55);
    			append_dev(div13, li11);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			if (detaching) detach_dev(t26);
    			if (detaching) detach_dev(section1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\Projectcard.svelte generated by Svelte v3.59.2 */

    const file$3 = "src\\components\\Projectcard.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let i;
    	let i_class_value;
    	let t0;
    	let h4;
    	let a;
    	let t1_value = /*project*/ ctx[0].title + "";
    	let t1;
    	let a_href_value;
    	let t2;
    	let p;
    	let t3_value = /*project*/ ctx[0].description + "";
    	let t3;
    	let t4;
    	let br;
    	let t5;
    	let li;
    	let t6_value = /*project*/ ctx[0].details + "";
    	let t6;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			h4 = element("h4");
    			a = element("a");
    			t1 = text(t1_value);
    			t2 = space();
    			p = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			br = element("br");
    			t5 = space();
    			li = element("li");
    			t6 = text(t6_value);
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*project*/ ctx[0].icon) + " svelte-drw5ai"));
    			add_location(i, file$3, 5, 4, 75);
    			attr_dev(a, "href", a_href_value = /*project*/ ctx[0].link);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$3, 6, 8, 113);
    			attr_dev(h4, "class", "svelte-drw5ai");
    			add_location(h4, file$3, 6, 4, 109);
    			attr_dev(p, "class", "svelte-drw5ai");
    			add_location(p, file$3, 7, 4, 182);
    			add_location(br, file$3, 8, 4, 216);
    			add_location(li, file$3, 9, 4, 228);
    			attr_dev(div, "class", "project svelte-drw5ai");
    			add_location(div, file$3, 4, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, h4);
    			append_dev(h4, a);
    			append_dev(a, t1);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    			append_dev(div, t4);
    			append_dev(div, br);
    			append_dev(div, t5);
    			append_dev(div, li);
    			append_dev(li, t6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*project*/ 1 && i_class_value !== (i_class_value = "" + (null_to_empty(/*project*/ ctx[0].icon) + " svelte-drw5ai"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*project*/ 1 && t1_value !== (t1_value = /*project*/ ctx[0].title + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*project*/ 1 && a_href_value !== (a_href_value = /*project*/ ctx[0].link)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*project*/ 1 && t3_value !== (t3_value = /*project*/ ctx[0].description + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*project*/ 1 && t6_value !== (t6_value = /*project*/ ctx[0].details + "")) set_data_dev(t6, t6_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projectcard', slots, []);
    	let { project } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (project === undefined && !('project' in $$props || $$self.$$.bound[$$self.$$.props['project']])) {
    			console.warn("<Projectcard> was created without expected prop 'project'");
    		}
    	});

    	const writable_props = ['project'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projectcard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('project' in $$props) $$invalidate(0, project = $$props.project);
    	};

    	$$self.$capture_state = () => ({ project });

    	$$self.$inject_state = $$props => {
    		if ('project' in $$props) $$invalidate(0, project = $$props.project);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [project];
    }

    class Projectcard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { project: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projectcard",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get project() {
    		throw new Error("<Projectcard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project(value) {
    		throw new Error("<Projectcard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Project.svelte generated by Svelte v3.59.2 */
    const file$2 = "src\\pages\\Project.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (78:12) {#each projects as project}
    function create_each_block(ctx) {
    	let projectcard;
    	let current;

    	projectcard = new Projectcard({
    			props: { project: /*project*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(projectcard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projectcard, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projectcard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projectcard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projectcard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(78:12) {#each projects as project}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let div2;
    	let div0;
    	let h4;
    	let t1;
    	let p;
    	let t3;
    	let div1;
    	let current;
    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div2 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = "My Projects";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Discover my projects, where creativity meets innovation";
    			t3 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h4, "class", "svelte-nwwue9");
    			add_location(h4, file$2, 73, 12, 3657);
    			attr_dev(p, "class", "svelte-nwwue9");
    			add_location(p, file$2, 74, 12, 3691);
    			attr_dev(div0, "class", "project-title svelte-nwwue9");
    			add_location(div0, file$2, 72, 8, 3616);
    			attr_dev(div1, "class", "projects svelte-nwwue9");
    			add_location(div1, file$2, 76, 8, 3779);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file$2, 71, 4, 3583);
    			attr_dev(section, "class", "project-content svelte-nwwue9");
    			add_location(section, file$2, 70, 0, 3544);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h4);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div2, t3);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div1, null);
    				}
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project', slots, []);

    	const projects = [
    		{
    			icon: "fa fa-handshake",
    			title: "Recommendation System",
    			link: "https://github.com/ragu8/RECOMMENDATION_SYSTEM",
    			description: "Correlation | Pandas | Netflix Dataset",
    			details: "The purpose of a recommender system is to suggest relevant items to users."
    		},
    		{
    			icon: "fa fa-chart-bar",
    			title: "Ozone Analysis",
    			link: "https://github.com/ragu8/OZONE_ANALYSIS",
    			description: "Visualization Techniques | Pandas & Matplotlib | NASA Dataset",
    			details: "Visualize the fluctuation of ozone depletion area and significant global events from 1979 to 2022 using visualization techniques."
    		},
    		{
    			icon: "fa fa-home",
    			title: "House Price Prediction",
    			link: "https://github.com/ragu8/HOUSE_PRICE_PREDICTION",
    			description: "LinearRegression | Sklearn | House Prices Dataset",
    			details: "To predict house prices using regression techniques, use a dataset containing relevant features and the corresponding house prices."
    		},
    		{
    			icon: "fa fa-exchange",
    			title: "GENERIC CLASSIFICATION",
    			link: "https://github.com/ragu8/CLASSIFICATION",
    			description: "Computer vision | Tensorflow | Image Datasets",
    			details: "This Deep Learning model achieves a high accuracy of 90% or above using a Convolutional Neural Network (CNN) on any Image dataset."
    		},
    		{
    			icon: "fa fa-clipboard",
    			title: "IMAGE CLASSIFICATION USING QCNN",
    			link: "https://github.com/ragu8/Quantum-Machine-Learning",
    			description: "Quantum | Tensorflow-Quantum | MNIST Dataset",
    			details: "Incorporating computation and QCNN in computer vision projects can potentially enhance results through advanced data processing and quantum machine learning."
    		},
    		{
    			icon: "fa fa-expand",
    			title: "HEART DISEASE PREDICTION",
    			link: "https://github.com/ragu8/HEART_DISEASE_PREDICTION",
    			description: "Statistical Analysis | EDA | ECG Dataset",
    			details: "Machine Learning for Heart Disease Prediction: Repository for implementing machine learning algorithms to predict heart disease, contributing to early diagnosis and proactive healthcare management."
    		},
    		{
    			icon: "fa fa-inr",
    			title: "STOCK PRICE PREDICTION",
    			link: "https://github.com/ragu8/com/blob/main/art.drawio.png",
    			description: "Predictive Analytics | yfinance | Stock Data",
    			details: "At Galaxy Technology Services, I built a Proof-Of-Concept using quantum computing to predict stock prices with an accuracy rate of 89%. This highlights the potential of quantum computing to significantly improve stock price prediction models."
    		},
    		{
    			icon: "fa fa-forward",
    			title: "VIDEO CLASSIFICATION",
    			link: "https://github.com/ragu8/Video_classification",
    			description: "Action Recognition | 3D CNN | Ucf101 Dataset",
    			details: "Video Classification using UCF101: Repository containing code and models for classifying videos based on the UCF101 dataset, utilizing deep learning techniques for action recognition."
    		},
    		{
    			icon: "fa fa-link",
    			title: "PDF QUERYING",
    			link: "https://github.com/ragu8/PDF_Extraction_and_DataMining_using_Langchain",
    			description: "OpenAI API | Langchain | Pdf Mining",
    			details: "PDF Extraction and Data Mining using Langchain: Repository for PDF querying, leveraging the OpenAI API and Langchain for efficient text extraction and data mining from PDF documents."
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Projectcard, projects });
    	return [projects];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Contact.svelte generated by Svelte v3.59.2 */

    const file$1 = "src\\pages\\Contact.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let div3;
    	let div0;
    	let h4;
    	let t1;
    	let p;
    	let t3;
    	let div1;
    	let a0;
    	let i0;
    	let t4;
    	let a1;
    	let i1;
    	let t5;
    	let a2;
    	let i2;
    	let t6;
    	let div2;
    	let form;
    	let input0;
    	let t7;
    	let input1;
    	let t8;
    	let textarea;
    	let t9;
    	let button;
    	let t11;
    	let span;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div0 = element("div");
    			h4 = element("h4");
    			h4.textContent = "Contact Me";
    			t1 = space();
    			p = element("p");
    			p.textContent = "Get In Touch";
    			t3 = space();
    			div1 = element("div");
    			a0 = element("a");
    			i0 = element("i");
    			t4 = space();
    			a1 = element("a");
    			i1 = element("i");
    			t5 = space();
    			a2 = element("a");
    			i2 = element("i");
    			t6 = space();
    			div2 = element("div");
    			form = element("form");
    			input0 = element("input");
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			textarea = element("textarea");
    			t9 = space();
    			button = element("button");
    			button.textContent = "Send Message";
    			t11 = space();
    			span = element("span");
    			attr_dev(h4, "class", "svelte-dd48ps");
    			add_location(h4, file$1, 6, 12, 149);
    			attr_dev(p, "class", "svelte-dd48ps");
    			add_location(p, file$1, 7, 12, 182);
    			attr_dev(div0, "class", "contact-title");
    			add_location(div0, file$1, 5, 8, 108);
    			attr_dev(i0, "class", "fa fa-envelope");
    			add_location(i0, file$1, 11, 17, 317);
    			attr_dev(a0, "href", "mailto:https.ragu@gmail.com");
    			add_location(a0, file$1, 10, 12, 261);
    			attr_dev(i1, "class", "fa-brands fa-github");
    			add_location(i1, file$1, 14, 17, 432);
    			attr_dev(a1, "href", "https://github.com/ragu8");
    			add_location(a1, file$1, 13, 12, 379);
    			attr_dev(i2, "class", "fa-brands fa-linkedin");
    			add_location(i2, file$1, 17, 17, 562);
    			attr_dev(a2, "href", "https://www.linkedin.com/in/ragu8/");
    			add_location(a2, file$1, 16, 12, 499);
    			attr_dev(div1, "class", "social");
    			add_location(div1, file$1, 9, 8, 227);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "placeholder", "Your Name");
    			input0.required = true;
    			attr_dev(input0, "class", "svelte-dd48ps");
    			add_location(input0, file$1, 23, 16, 736);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "name", "email");
    			attr_dev(input1, "placeholder", "Your Email");
    			input1.required = true;
    			attr_dev(input1, "class", "svelte-dd48ps");
    			add_location(input1, file$1, 29, 16, 921);
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "placeholder", "Your Message");
    			attr_dev(textarea, "rows", "5");
    			textarea.required = true;
    			attr_dev(textarea, "class", "svelte-dd48ps");
    			add_location(textarea, file$1, 35, 16, 1109);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "submit svelte-dd48ps");
    			add_location(button, file$1, 41, 16, 1310);
    			attr_dev(span, "id", "msg");
    			attr_dev(span, "class", "svelte-dd48ps");
    			add_location(span, file$1, 42, 16, 1386);
    			attr_dev(form, "id", "contact-form");
    			attr_dev(form, "method", "POST");
    			add_location(form, file$1, 22, 12, 680);
    			attr_dev(div2, "class", "contact svelte-dd48ps");
    			add_location(div2, file$1, 21, 8, 645);
    			attr_dev(div3, "class", "container");
    			add_location(div3, file$1, 4, 4, 75);
    			attr_dev(section, "class", "contact-content svelte-dd48ps");
    			attr_dev(section, "id", "contact");
    			add_location(section, file$1, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div0);
    			append_dev(div0, h4);
    			append_dev(div0, t1);
    			append_dev(div0, p);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, a0);
    			append_dev(a0, i0);
    			append_dev(div1, t4);
    			append_dev(div1, a1);
    			append_dev(a1, i1);
    			append_dev(div1, t5);
    			append_dev(div1, a2);
    			append_dev(a2, i2);
    			append_dev(div3, t6);
    			append_dev(div3, div2);
    			append_dev(div2, form);
    			append_dev(form, input0);
    			append_dev(form, t7);
    			append_dev(form, input1);
    			append_dev(form, t8);
    			append_dev(form, textarea);
    			append_dev(form, t9);
    			append_dev(form, button);
    			append_dev(form, t11);
    			append_dev(form, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.59.2 */

    const file = "src\\components\\Footer.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let footer;
    	let small0;
    	let t1;
    	let small1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			footer = element("footer");
    			small0 = element("small");
    			small0.textContent = "Thanks for visiting and happy coding!";
    			t1 = space();
    			small1 = element("small");
    			small1.textContent = "© Copyright 2023. All rights reserved.";
    			attr_dev(small0, "class", "message svelte-6tydsh");
    			add_location(small0, file, 5, 8, 85);
    			attr_dev(small1, "class", "copyright svelte-6tydsh");
    			add_location(small1, file, 6, 8, 163);
    			attr_dev(footer, "class", "footer svelte-6tydsh");
    			add_location(footer, file, 4, 4, 52);
    			attr_dev(div, "class", "container");
    			add_location(div, file, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, footer);
    			append_dev(footer, small0);
    			append_dev(footer, t1);
    			append_dev(footer, small1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.2 */

    function create_fragment(ctx) {
    	let navbar;
    	let t0;
    	let router;
    	let t1;
    	let footer;
    	let current;
    	navbar = new Navbar({ $$inline: true });

    	router = new Router({
    			props: { routes: /*routes*/ ctx[0] },
    			$$inline: true
    		});

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			create_component(router.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(router, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(router, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const routes = {
    		"/home": Home,
    		"/about": About,
    		"/projects": Project,
    		"/contact": Contact
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Navbar,
    		Home,
    		About,
    		Project,
    		Contact,
    		Footer,
    		routes
    	});

    	return [routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,

    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
