import React, { FC, useEffect, useState, useCallback, useRef } from 'react';
import DefaultPagination from '@/components/Pagination';

interface PaginationProps {
	current: number;
	pageSize: number;
	total: number;
	onChange?: (current: number, pageSize?: number) => any;
}

export default function usePagination<T>(
	list: T[],
	pageSize: number,
	Pagination: FC<PaginationProps> = DefaultPagination
): [T[], number, FC] {
	const total = list.length;
	const pageId = location.pathname + location.hash;
	const key = `page_${pageId}`;
	const initPage = sessionStorage.getItem(key) || '1';
	const [page, setPage] = useState<number>(Number(initPage) || 1);
	const [pagingList, setPagingList] = useState<T[]>([]);
	const PageComp: FC = useCallback(() => {
		return (
			<Pagination
				current={page}
				total={total}
				onChange={nextPage => {
					sessionStorage.setItem(key, String(nextPage));
					setPage(nextPage);
				}}
				pageSize={pageSize}
			/>
		);
	}, [page, total, pageSize, Pagination]);
	useEffect(() => {
		setPagingList(list.slice((page - 1) * pageSize, page * pageSize));
	}, [list, total, pageSize, page]);
	return [pagingList, page, PageComp];
}
