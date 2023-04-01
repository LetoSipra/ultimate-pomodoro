import { db } from "@/firebase";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  HiChevronUp,
  HiChevronDown,
  HiOutlineTrash,
  HiPencilSquare,
  HiCheck,
} from "react-icons/hi2";

interface Props {
  listdata: ToDoList[];
}

function ToDoList({ listdata }: Props) {
  const [input, setInput] = useState<string>("");
  const [array, setArray] = useState<any>(listdata);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const scrollRef = useRef() as MutableRefObject<HTMLLIElement>;
  const doneButtonRef = useRef() as MutableRefObject<HTMLButtonElement>;
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [editInput, setEditInput] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);

  const addTaskToDB = async () => {
    if (!session) return;
    setLoading(true);
    const newKey = array.length + 1;
    await addDoc(
      collection(db, "UserData", `${session.user.uid}`, "ToDoTasks"),
      {
        text: input,
        timestamp: serverTimestamp(),
        key: newKey,
      }
    );
    setLoading(false);
  };

  //   useEffect(() => {
  //     if (!session) return;
  //     onSnapshot(
  //       query(
  //         collection(db, "UserData", `${session.user.uid}`, "ToDoTasks"),
  //         orderBy("key", "asc")
  //         //limit(100)
  //       ),
  //       (snapshot: any) => {
  //         setArray(snapshot.docs);
  //       }
  //     );
  // await setDoc(doc(db, `${session.user.uid}`, `${newdoc.id}`), {
  //   text: input,
  // });
  //   }, [db]);

  const onMoveUp = (key: number) => {
    if (key === 0) return;
    const items = [...array];
    const index = key - 1;
    const itemAbove = items[index];
    items[key - 1] = items[key];
    items[key] = itemAbove;
    setArray(items);
  };

  const onMoveDown = (key: number) => {
    const items = [...array];
    if (key === items.length - 1) return;
    const index = key + 1;
    const itemBelow = items[index];
    items[key + 1] = items[key];
    items[key] = itemBelow;
    setArray(items);
  };

  const deleteItem = (id: string) => {
    const newArray: ToDoList[] = array.filter(
      (filter: ToDoList) => filter.id !== id
    );
    setArray(newArray);
  };

  const addItem = () => {
    if (input.length < 1) return;
    const newValue: ToDoList = {
      id: new Date().getTime().toString(),
      text: input,
      edit: false,
    };
    setArray([...array, newValue]);
    setInput("");
    inputRef.current.focus();
  };

  const editItem = (key: number) => {
    if (edit) return;
    setEdit(true);
    array[key].edit = true;
    setEditInput(array[key].text);
    setArray([...array]);
  };

  const finishEdit = (key: number) => {
    setEdit(false);
    array[key].text = editInput;
    array[key].edit = false;
    setEditInput("");
    setArray([...array]);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      edit ? doneButtonRef.current.click() : addItem();
    }
    inputRef.current.focus();
  };

  useEffect(() => {
    const syncData = async () => {
      if (loading) return;
      if (!session) return;
      setLoading(true);
      await setDoc(doc(db, "UserData", `${session.user.uid}`), {
        ToDoList: array,
      });
      console.log("shit");

      setLoading(false);
    };
    syncData();
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [array]);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
    setLoading(false);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  return (
    <>
      {/* Body */}
      <div className="h-[calc(100vh_-_282px)] max-h-[[calc(100vh_-_272px)]] overflow-y-scroll scrollbar-hide">
        <ul className="">
          <h1>{loading ? "ye" : "no"}</h1>
          {array.map((value: ToDoList, key: number) => (
            <li className="" key={value.id}>
              <div className="mx-10 flex border-b">
                <div className="h-5 w-5 rounded-full border-2"></div>
                {!value.edit ? (
                  <p className="w-full overflow-auto break-words">
                    {value.text}
                  </p>
                ) : (
                  <input
                    type="text"
                    maxLength={250}
                    value={editInput}
                    onChange={(e) => {
                      setEditInput(e.target.value);
                    }}
                    autoFocus
                    className="w-full overflow-auto break-words bg-black outline-none"
                    id={value.id}
                  />
                )}
                {/* icons */}
                <div className="flex">
                  {value.edit ? (
                    <button ref={doneButtonRef} onClick={() => finishEdit(key)}>
                      <HiCheck className="h-5 w-6 cursor-pointer" />
                    </button>
                  ) : (
                    <HiPencilSquare
                      className="h-5 w-6 cursor-pointer"
                      onClick={() => editItem(key)}
                    />
                  )}
                  <HiChevronUp
                    className="h-5 w-6 cursor-pointer"
                    onClick={() => onMoveUp(key)}
                  />
                  <HiChevronDown
                    className="h-5 w-6 cursor-pointer"
                    onClick={() => onMoveDown(key)}
                  />
                  <HiOutlineTrash
                    className="h-5 w-6 text-[red]"
                    onClick={() => deleteItem(value.id)}
                  />
                </div>
              </div>
            </li>
          ))}
          <li ref={scrollRef}></li>
        </ul>
      </div>
      {/* input */}
      <div className="mx-10 flex border">
        <p className="cursor-pointer text-2xl" onClick={() => addItem()}>
          +
        </p>
        <input
          placeholder="Add a task"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={250}
          className="w-full bg-black outline-none placeholder:text-white"
        />
      </div>
    </>
  );
}

export default ToDoList;
