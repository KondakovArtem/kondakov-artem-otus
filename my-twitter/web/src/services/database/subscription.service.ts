import {firestore, QuerySnapshot} from 'services/firebase';
import {
  SubscriptionTypes,
  IDbSubscription,
  IRegisterDbSubscription,
  IDBDocument,
  TMutationType,
} from 'models/firebase.model';
import {each} from 'lodash-es';
import {convertRawtoObject} from 'services/core/core.service';

export const subscriptions: {
  [alias: string]: IDbSubscription;
} = {};

interface IMutation {
  type: TMutationType;
  doc: any;
}

const getMutationSubsr = (callback: (mutationList: IMutation[]) => void) => (
  snapshot: QuerySnapshot,
  error?: Error,
) => {
  if (error) {
    console.log(error);
  }
  const docMutationList: IMutation[] = snapshot.docChanges().map(({doc: docMeta, type}) => {
    const doc: IDBDocument = convertRawtoObject({
      ...docMeta.data(),
      id: docMeta.id,
    });
    return {
      type,
      doc: {
        ...doc,
        createdAt: doc.createdAt || new Date(),
      },
    };
  });
  docMutationList.length && callback(docMutationList);
};

export const registerDbSubscriber = ({alias, path, type, callback, filter}: IRegisterDbSubscription) => {
  let unsubscribe;
  if (type === SubscriptionTypes.DOC) {
    unsubscribe = firestore()
      .doc(path)
      .onSnapshot(querySnapshot => callback(convertRawtoObject(querySnapshot.data())));
  } else {
    const colReference = firestore().collection(path);
    unsubscribe = filter
      ? filter(colReference).onSnapshot(getMutationSubsr(callback))
      : colReference.onSnapshot(getMutationSubsr(callback));
  }
  const {unsubscribes = []} = subscriptions[alias] || {};
  subscriptions[alias] = {
    path,
    unsubscribes: [...unsubscribes, unsubscribe],
  };
};

export const unregisterDbSubscriber = (alias: string) => {
  if (subscriptions[alias]) {
    each(subscriptions[alias].unsubscribes, unsubscribe => unsubscribe());
    delete subscriptions[alias];
  }
};

export const unregisterAllDbSubsribers = () => {
  each(subscriptions, (data, alias) => {
    unregisterDbSubscriber(alias);
  });
};

export const getDbSubscriber = (alias: string) => {
  return subscriptions[alias];
};
