import { db } from "../../firebase/config";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { App } from "~/types/generic";
import easyKitUtils from "easy-kit-utils";

const config = useRuntimeConfig();
const { isTrue } = easyKitUtils;

export async function tryGetList(): Promise<App[] | undefined> {
  try {
    const querySnapshot = await getDocs(
      collection(db, config.public.appCollection as string)
    );
    let appList: App[] = [];

    if (!isTrue(querySnapshot.empty)) {
      const promises = querySnapshot.docs
        .sort((a, b) => ("" + a.data().title).localeCompare(b.data().title))
        .map(async (doc: any) => {
          let app: App = {
            id: doc.id,
            title: doc.data().title,
            platforms: doc.data().platforms,
            description: doc.data().description,
            website: doc.data().website,
            repository: doc.data().repository,
            isActive: doc.data().isActive,
          };

          appList.push(app);
        });

      await Promise.all(promises);
    }

    return appList;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function tryDeleteApp(id: string) {
  try {
    await deleteDoc(doc(db, `/${config.public.appCollection as string}/${id}`));
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function tryAddApp(app: App) {
  try {
    let result = await addDoc(
      collection(db, config.public.appCollection as string),
      app
    );
    return result.id;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function tryEditApp(app: App) {
  try {
    let docRef = doc(db, config.public.appCollection as string, app.id);

    await updateDoc(docRef, {
      title: app.title,
      platforms: app.platforms,
      description: app.description,
      website: app.website,
      repository: app.repository,
    });

    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function tryEditAppStatus(app: App) {
  try {
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}
