import { INotyfNotificationOptions, INotyfOptions, Notyf } from 'notyf';
import { useEffect, useState } from 'react';

type INotificationOptions = string | Partial<INotyfNotificationOptions>;

export default function useToast(options?: Partial<INotyfOptions>) {
	const [memoOptions, setOptions] = useState(options);
	const [toast, setToast] = useState({
		success: (payload: INotificationOptions): any => {},
		error: (payload: INotificationOptions): any => {},
	} as Notyf);

	useEffect(() => {
		if (!deepEqual(options, memoOptions)) {
			setOptions(options);
		}
	}, [options, memoOptions]);

	useEffect(() => {
		const notyf = new Notyf(memoOptions);
		setToast(notyf);
	}, [memoOptions]);

	return toast;
}

const deepEqual = (a: any, b: any): boolean => {
	if (a === b) return true;

	if (typeof a != 'object' || typeof b != 'object' || a == null || b == null)
		return false;

	let keysA = Object.keys(a),
		keysB = Object.keys(b);

	if (keysA.length != keysB.length) return false;

	for (let key of keysA) {
		if (!keysB.includes(key)) return false;

		if (typeof a[key] === 'function' || typeof b[key] === 'function') {
			if (a[key].toString() != b[key].toString()) return false;
		} else {
			if (!deepEqual(a[key], b[key])) return false;
		}
	}

	return true;
};
