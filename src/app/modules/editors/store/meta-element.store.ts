import { MetaElement } from '../entities/meta-element';

const allMetaElements: MetaElement[] = [];

export const MetaElementStore = {
  add(element: MetaElement): number {
    return allMetaElements.push(element);
  },

  findMetaByElementId(elementId: string | number): MetaElement | void {
    return allMetaElements.filter(meta => meta.data.id === elementId || parseFloat(`${meta.data.id}`) === parseFloat(`${elementId}`))[0];
  },

  findMetaByLocalId(localId: number): MetaElement | void {
    return allMetaElements.filter(meta => meta.localId === localId)[0];
  },

  findMetaSiblings(metaElement: MetaElement): MetaElement[] {
    const parentMetaId = metaElement && metaElement.treeLocation && metaElement.treeLocation.parentMetaElementId;

    return allMetaElements.filter(
      meta => meta.treeLocation
        && meta.treeLocation.parentMetaElementId === parentMetaId);
  },

  getMetaElements(): MetaElement[] {
    return allMetaElements;
  },

  findNewMetaElements(pageId: string): MetaElement[] {
    return allMetaElements.filter(meta => meta.isNewElement);
  },

  onElementsReady(): Promise<any> {
    return Promise.all(allMetaElements.map(metaElement => metaElement.onSaveReady));
  },

  purge(): void {
    allMetaElements.splice(0, allMetaElements.length);
  }
};
