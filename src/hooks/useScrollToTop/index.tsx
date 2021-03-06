import React, { useEffect, useState, FC, useRef, CSSProperties } from 'react';
import SIcon from '@/components/SIcon';
import styles from './style.module.scss';
import cs from 'classnames';

interface ToTopProps {
	className?: string;
	style?: CSSProperties;
	target?: HTMLElement;
}

const ToTopComp: FC<ToTopProps> = ({ className, style, target = document.documentElement }) => {
	return (
		<button
			className={cs(styles.toTop, className)}
			style={style}
			onClick={() => target.scrollTo({ left: 0, top: 0, behavior: 'smooth' })}
		>
			<SIcon className={styles.toTopIcon} name="arrow-down-hollow" />
		</button>
	);
};

export default function useScrollToTop(target: HTMLElement = document.documentElement) {
	const [ToTop, setToTop] = useState<FC<ToTopProps> | null>(null);
	const ref = useRef<() => void>();
	ref.current = () => {
		let scrollY = target.scrollTop;
		if (scrollY > 200) {
			// 滚动距离超过200px，展示置顶按钮
			!ToTop && setToTop(() => ToTopComp);
		} else {
			ToTop && setToTop(null);
		}
	};
	useEffect(() => {
		const callback = (e: Event) => {
			ref.current && ref.current();
		};
		target.addEventListener('scroll', callback);
		return () => {
			target.removeEventListener('scroll', callback);
		};
	}, [target]);
	return ({ className, style }: ToTopProps) => {
		return ToTop && <ToTop className={className} style={style} target={target} />;
	};
}
