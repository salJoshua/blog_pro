import React from 'react';
import docArray from '@/assets/md';

interface MdDoc {
	title: string;
	createTime: number;
	modifyTime: number;
	group: string[];
	tag?: string[];
	content: string;
}

interface Tag {
	articles: MdDoc[];
	size: number;
	name: string;
}

interface Group {
	name: string;
	articles: MdDoc[];
	children?: Group[];
}

interface DocInfo {
	articles: MdDoc[];
	tags: Tag[];
	group: Group[];
}

const DocCtx = React.createContext<DocInfo>({
	articles: [],
	tags: [],
	group: []
});

function resolveTags(docArray: MdDoc[], result: Tag[]): void {
	let tagObj: { [key: string]: MdDoc[] } = {};
	docArray.forEach(doc => {
		const { tag } = doc;
		if (tag) {
			Array.from(new Set(tag)).forEach(t => {
				if (!tagObj[t]) {
					tagObj[t] = [];
				}
				tagObj[t].push(doc);
			});
		}
	});
	Object.keys(tagObj)
		.sort((a, b) => (a > b ? 1 : -1))
		.forEach(name => {
			const articles = tagObj[name].sort((a, b) => b.modifyTime - a.modifyTime);
			result.push({
				name,
				size: articles.length,
				articles
			});
		});
}

interface GroupObjItem {
	key: string;
	name: string;
	articles: MdDoc[];
	parent: string;
}

function resolveGroupTree(groupList: GroupObjItem[], allGroupList: GroupObjItem[], result: Group[]) {
	groupList.forEach(group => {
		const { key, name, articles, parent } = group;
		const resultItem: Group = {
			name,
			articles
		};
		result.push(resultItem);
		const children = allGroupList.filter(g => g.parent === key).sort((a, b) => (a.name > b.name ? 1 : -1));
		if (children && children.length) {
			resultItem.children = [];
			resolveGroupTree(children, allGroupList, resultItem.children);
		}
	});
}

function resolveGroups(docArray: MdDoc[], result: Group[]): void {
	let groupObj: { [key: string]: GroupObjItem } = {};
	docArray.forEach(doc => {
		const { group } = doc;
		let key: string, name: string, parent: string;
		if (group && group.length) {
			key = group.join('/');
			name = group.slice(-1)[0];
			parent = group.slice(0, -1).join('/');
		} else {
			key = '无分组';
			name = '无分组';
			parent = '';
		}
		if (!groupObj[key]) {
			groupObj[key] = {
				key,
				name,
				articles: [],
				parent
			};
		}
		groupObj[key].articles.push(doc);
	});
	const keys = Object.keys(groupObj);
	const groupList = keys.map(key => groupObj[key]);
	const topGroup = keys
		.filter(key => !groupObj[key].parent)
		.sort((a, b) => (a > b ? 1 : -1))
		.map(key => groupObj[key]);
	resolveGroupTree(topGroup, groupList, result);
}

export const Provider: React.FC = ({ children }) => {
	const tags: Tag[] = [],
		group: Group[] = [];
	resolveTags(docArray, tags);
	resolveGroups(docArray, group);
	const DocInfo = {
		articles: docArray,
		tags,
		group
	};
	return <DocCtx.Provider value={DocInfo}>{children}</DocCtx.Provider>;
};

export default DocCtx;