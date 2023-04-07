import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  HiChevronUp,
  HiChevronDown,
  HiOutlineTrash,
  HiPencilSquare,
  HiCheck,
  HiChevronRight,
  HiPlus,
} from "react-icons/hi2";
import { Disclosure } from "@headlessui/react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
  listdata: ToDoList[];
  completedToDos: ToDoList[];
}

function ToDoList({ listdata, completedToDos }: Props) {
  const [input, setInput] = useState<string>("");
  const [array, setArray] = useState<ToDoList[]>(listdata || []);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const scrollRef = useRef() as MutableRefObject<HTMLLIElement>;
  const doneButtonRef = useRef() as MutableRefObject<HTMLButtonElement>;
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [editInput, setEditInput] = useState<string>("");
  const [edit, setEdit] = useState<boolean>(false);
  const [completedItems, setCompletedItems] = useState<ToDoList[]>(
    completedToDos || []
  );
  const [animationParent] = useAutoAnimate();

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
    const newArray = array.filter((filter) => filter.id !== id);
    setArray(newArray);
  };

  const deleteItemFromCompleted = (id: string) => {
    const newArray = completedItems.filter((filter) => filter.id !== id);
    setCompletedItems(newArray);
  };

  const addItem = () => {
    inputRef.current.focus();
    if (input.length < 1) return;
    const newValue = {
      id: new Date().getTime().toString(),
      text: input,
      edit: false,
    };
    setArray([...array, newValue]);
    setInput("");
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
  };

  const removeToCompleted = (id: string) => {
    const completedItem = array.filter((filter) => filter.id === id)[0];
    setCompletedItems([...completedItems, completedItem]);
  };

  const removeToList = (id: string) => {
    const completedItem = completedItems.filter(
      (filter) => filter.id === id
    )[0];
    setArray([...array, completedItem]);
  };

  useEffect(() => {
    const syncData = async () => {
      if (loading) return;
      if (!session) return;
      setLoading(true);
      await setDoc(doc(db, `${session.user.uid}`, "Default"), {
        ToDoList: array,
        CompletedToDos: completedItems,
      });
      console.log("shit");

      setLoading(false);
    };
    syncData();
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, [array, completedItems]);

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
      <div className="mx-2 my-2 h-[calc(47vh_-_12px)] rounded-xl border-2 border-solid border-white/10 bg-white/5 px-3 py-1 outline outline-white/10 lg:my-10 lg:h-[calc(94vh_-_80px)] lg:w-[50%]">
        <div className="h-[calc(100%_-_56px)] overflow-y-scroll scrollbar-hide">
          <ul className="" ref={animationParent}>
            {array?.map((value, key) => (
              <li
                className="group/icons relative my-2 flex rounded-md border-b border-white/25 bg-white/10 p-2 transition duration-200 hover:bg-white/20"
                key={value.id}>
                <button
                  className="group/tick h-6 w-6 flex-none rounded-full border-2 border-solid"
                  onClick={() => {
                    removeToCompleted(value.id);
                    deleteItem(value.id);
                  }}>
                  <HiCheck className="m-auto hidden h-5 w-5 group-hover/tick:flex" />
                </button>
                {!value.edit ? (
                  <p className="mx-2 w-full overflow-auto break-words">
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
                    className="mx-2 w-full bg-white/10 outline-none"
                    id={value.id}
                  />
                )}
                {/* icons */}
                <div
                  className="right-3 hidden space-x-1 rounded-md bg-black/80 outline outline-black/80
                group-hover/icons:absolute group-hover/icons:flex">
                  {value.edit ? (
                    <button ref={doneButtonRef} onClick={() => finishEdit(key)}>
                      <HiCheck className="h-6 w-6 cursor-pointer rounded-md text-orange-400 transition duration-300 hover:bg-white/25" />
                    </button>
                  ) : (
                    <HiPencilSquare
                      className="h-6 w-6 cursor-pointer rounded-md text-orange-400 transition duration-300 hover:bg-white/25"
                      onClick={() => editItem(key)}
                    />
                  )}
                  <HiChevronUp
                    className="h-6 w-6 cursor-pointer rounded-md text-yellow-300 transition duration-300 hover:bg-white/25"
                    onClick={() => onMoveUp(key)}
                  />
                  <HiChevronDown
                    className="h-6 w-6 cursor-pointer rounded-md text-yellow-300 transition duration-300 hover:bg-white/25"
                    onClick={() => onMoveDown(key)}
                  />
                  <HiOutlineTrash
                    className="h-6 w-6 cursor-pointer rounded-md text-[red] transition duration-300 hover:bg-white/25"
                    onClick={() => deleteItem(value.id)}
                  />
                </div>
              </li>
            ))}
            <li ref={scrollRef}></li>
            {/* CompletedItems Disclosure */}
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="group/icons relative my-2 flex space-x-2.5 rounded-md border-b border-white/25 bg-white/10 p-2 transition duration-200 hover:bg-white/20">
                    {completedItems.length > 0 && open ? (
                      <HiChevronDown className="my-auto h-5 w-5" />
                    ) : (
                      <HiChevronRight className="my-auto h-5 w-5" />
                    )}
                    <p>Completed</p>
                    <p>{completedItems && completedItems.length}</p>
                  </Disclosure.Button>
                  <Disclosure.Panel className="text-gray-400 line-through">
                    {completedItems?.map((value) => (
                      <li className="group/icons relative my-2 flex rounded-md border-b border-white/25 bg-white/10 p-2 transition duration-200 hover:bg-white/20">
                        <button
                          className="h-6 w-6 flex-none rounded-full border-2 border-solid"
                          onClick={() => {
                            removeToList(value.id);
                            deleteItemFromCompleted(value.id);
                          }}>
                          <HiCheck className="m-auto h-5 w-5 text-white" />
                        </button>
                        <p className="mx-2 w-full overflow-auto break-words">
                          {value.text}
                        </p>
                        {/* icons */}
                        <div
                          className="right-3 hidden space-x-1 rounded-md bg-black/30 outline outline-black/30
                group-hover/icons:absolute group-hover/icons:flex">
                          <HiOutlineTrash
                            className="h-6 w-6 cursor-pointer rounded-md  text-[red] transition duration-300 hover:bg-white/25"
                            onClick={() => deleteItemFromCompleted(value.id)}
                          />
                        </div>
                      </li>
                    ))}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </ul>
        </div>
        {/* input */}
        <div className="relative my-2 flex space-x-1 rounded-md border-white/25 bg-white/10 p-2 transition duration-200 hover:bg-white/20">
          <HiPlus
            className="h-6 w-6 cursor-pointer rounded-md text-2xl text-[#00FFFF] transition duration-300 hover:bg-white/25"
            onClick={() => addItem()}
          />
          <input
            placeholder="Add a task"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={250}
            className="w-full bg-transparent outline-none placeholder:pl-1 placeholder:text-white"
          />
        </div>
      </div>
    </>
  );
}

export default ToDoList;
