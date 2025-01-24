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

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
