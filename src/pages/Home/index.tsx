import React, { useContext, useEffect } from 'react';
import DocCtx from '@/ctx/DocCtx';
import StateCtx from '@/ctx/StateCtx';
import cs from 'classnames';
import DocCard from '@/components/DocCard';
import styles from './style.module.scss';
import usePagination from '@/hooks/usePagination';

export const a = 1;

function Home({ className }: { className?: string }) {
	const docInfo = useContext(DocCtx);
	const { scrollElement } = useContext(StateCtx);
	// console.log('docInfo', docInfo);
	const { articles } = docInfo;
	const [list, page, Pagination] = usePagination(articles, 5);
	useEffect(() => {
		scrollElement.scrollTo({ left: 0, top: 0 });
	}, [page, scrollElement]);
	return (
		<div className={cs(styles.home, className)}>
			<ul>
				{list.map((doc, i) => {
					const { title } = doc;
					return (
						<li key={title + `_${i}`}>
							<DocCard mini doc={doc} />
						</li>
					);
				})}
			</ul>
			<Pagination />
		</div>
	);
}

export default Home;
