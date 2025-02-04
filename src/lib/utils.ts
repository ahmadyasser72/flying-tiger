import { DateFormatter } from '@internationalized/date';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const dateFormatter = new DateFormatter('id-ID', { dateStyle: 'long' });
export const dateTimeFormatter = new DateFormatter('id-ID', {
	dateStyle: 'short',
	timeStyle: 'short'
});

export const getFileExtension = (source: string) => source.split('.').pop();
export const inheritFileExtension = (source: string, target: string) => {
	const ext = getFileExtension(source);
	return ext !== undefined ? `${target}.${ext}` : target;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
