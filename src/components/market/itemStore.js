import GlassOfWine from "./accessories/GlassOfWine";
import Clover from "./accessories/Clover";
import React from "react";
import Hourglass from "./accessories/Hourglass";
import PiggyBank from "./accessories/PiggyBank";
import Butterfly from "./accessories/Butterfly";
import Bee from "./accessories/Bee";
import Burger from "./accessories/Burger";
import Monster from "./accessories/Monster";
import Crown from "./accessories/Crown";
import Ghost from "./accessories/Ghost";
import Sword from "./accessories/Sword";
import Sunglasses from "./accessories/Sunglasses";
import GrayFish from "./accessories/GrayFish";
import Martini from "./accessories/Martini";
import LightBulb from "./accessories/LightBulb";
import IceCream from "./accessories/IceCream";
import Strawberry from "./accessories/Strawberry";
import Skull from "./accessories/Skull";
import FireExtinguisher from "./accessories/FireExtinguisher";
import Ship from "./accessories/Ship";
import Torturer from "./accessories/Torturer";
import HellAmulet from "./accessories/HellAmulet";
import SmirkingDemon from "./accessories/SmirkingDemon";
import Pacifier from "./accessories/Pacifier";
import Invisible from "./accessories/Invisible";
import SunriseCocktail from "./accessories/SunriseCocktail";
import CosmapolitanGlitch from "./accessories/CosmapolitanGlitch";
import Shuriken from "./accessories/Shuriken";
import Grenade from "./accessories/Grenade";
import GoldGlasses from "./accessories/GoldenGlasses";
import Dinosaur from "./accessories/Dinosaur";
import Voodoo from "./accessories/Voodoo";
import Compass from "./accessories/Compass";
import VintageCar from "./accessories/VintageCar";
import ToyRobot from "./accessories/ToyRobot";
import Rip from "./accessories/Rip";
import BacklitPumpkin from "./accessories/BacklitPumpkin";
import Gamepad from "./accessories/Gamepad";
import Rocket from "./accessories/Rocket";
import Tutanchamun from "./accessories/Tutanchamun";
import CubicToyCat from "./accessories/CubicToyCat";
import ScubaGlasses from "./accessories/ScubaGlasses";
import Vendetta from "./accessories/Vendetta";
import Mummy from "./accessories/Mummy";
import CupCoffee from "./accessories/CupCoffee";
import Slippers from "./accessories/Slippers";
import DiverHelmet from "./accessories/DiverHelmet";

const glassOfWine = (className) => <GlassOfWine className={className}/>
const clover = (className) => <Clover className={className}/>
const hourglass = (className) => <Hourglass className={className}/>
const piggyBank = (className) => <PiggyBank className={className}/>
const butterfly = (className) => <Butterfly className={className}/>
const bee = (className) => <Bee className={className}/>
const burger = (className) => <Burger className={className}/>
const monster = (className) => <Monster className={className}/>
const crown = (className) => <Crown className={className}/>
const ghost = (className) => <Ghost className={className}/>
const sword = (className) => <Sword className={className}/>
const sunglasses = (className) => <Sunglasses className={className}/>
const grayFish = (className) => <GrayFish className={className}/>
const martini = (className) => <Martini className={className}/>
const lightBulb = (className) => <LightBulb className={className}/>
const iceCream = (className) => <IceCream className={className}/>
const strawberry = (className) => <Strawberry className={className}/>
const skull = (className) => <Skull className={className}/>
const fireExtinguisher = (className) => <FireExtinguisher className={className}/>
const ship = (className) => <Ship className={className}/>
const torturer = (className) => <Torturer className={className}/>
const hellAmulet = (className) => <HellAmulet className={className}/>
const smirkingDemon = (className) => <SmirkingDemon className={className}/>
const pacifier = (className) => <Pacifier className={className}/>
const invisible = (className) => <Invisible className={className}/>
const sunriseCocktail = (className) => <SunriseCocktail className={className}/>
const cosmapolitanGlitch = (className) => <CosmapolitanGlitch className={className}/>
const shuriken = (className) => <Shuriken className={className}/>
const grenade = (className) => <Grenade className={className}/>
const goldenGlasses = (className) => <GoldGlasses className={className}/>
const dinosaur = (className) => <Dinosaur className={className}/>
const voodoo = (className) => <Voodoo className={className}/>
const compass = (className) => <Compass className={className}/>
const vintageCar = (className) => <VintageCar className={className}/>
const toyRobot = (className) => <ToyRobot className={className}/>
const rip = (className) => <Rip className={className}/>
const backlitPumpkin = (className) => <BacklitPumpkin className={className}/>
const gamepad = (className) => <Gamepad className={className}/>
const rocket = (className) => <Rocket className={className}/>
const tutanchamun = (className) => <Tutanchamun className={className}/>
const cubicToyCat = (className) => <CubicToyCat className={className}/>
const scubaGlasses = (className) => <ScubaGlasses className={className}/>
const vendetta = (className) => <Vendetta className={className}/>
const mummy = (className) => <Mummy className={className}/>
const cupCoffee = (className) => <CupCoffee className={className}/>
const slippers = (className) => <Slippers className={className}/>
const diverHelmet = (className) => <DiverHelmet className={className}/>

const itemMap = new Map([
  ['glassOfWine', {getIcon: glassOfWine}],
  ['clover', {getIcon: clover}],
  ['hourglass', {getIcon: hourglass, specialEffects: ["MarketPage.Items.hourglass.SpecialEffect1"]}],
  ['piggyBank', {getIcon: piggyBank}],
  ['butterfly', {getIcon: butterfly}],
  ['bee', {getIcon: bee}],
  ['burger', {getIcon: burger}],
  ['monster', {getIcon: monster}],
  ['crown', {getIcon: crown}],
  ['ghost', {getIcon: ghost}],
  ['sword', {getIcon: sword}],
  ['sunglasses', {getIcon: sunglasses}],
  ['grayFish', {getIcon: grayFish}],
  ['martini', {getIcon: martini}],
  ['lightBulb', {getIcon: lightBulb}],
  ['iceCream', {getIcon: iceCream}],
  ['strawberry', {getIcon: strawberry}],
  ['skull', {getIcon: skull}],
  ['fireExtinguisher', {getIcon: fireExtinguisher}],
  ['ship', {getIcon: ship}],
  ['torturer', {getIcon: torturer}],
  ['hellAmulet', {getIcon: hellAmulet}],
  ['smirkingDemon', {getIcon: smirkingDemon}],
  ['pacifier', {getIcon: pacifier}],
  ['invisible', {getIcon: invisible}],
  ['sunriseCocktail', {getIcon: sunriseCocktail}],
  ['cosmapolitanGlitch', {getIcon: cosmapolitanGlitch}],
  ['shuriken', {getIcon: shuriken}],
  ['grenade', {getIcon: grenade}],
  ['goldenGlasses', {getIcon: goldenGlasses}],
  ['dinosaur', {getIcon: dinosaur}],
  ['voodoo', {getIcon: voodoo}],
  ['compass', {getIcon: compass}],
  ['vintageCar', {getIcon: vintageCar}],
  ['toyRobot', {getIcon: toyRobot}],
  ['rip', {getIcon: rip}],
  ['backlitPumpkin', {getIcon: backlitPumpkin}],
  ['gamepad', {getIcon: gamepad}],
  ['rocket', {getIcon: rocket}],
  ['tutanchamun', {getIcon: tutanchamun}],
  ['cubicToyCat', {getIcon: cubicToyCat}],
  ['scubaGlasses', {getIcon: scubaGlasses}],
  ['vendetta', {getIcon: vendetta}],
  ['mummy', {getIcon: mummy}],
  ['cupCoffee', {getIcon: cupCoffee}],
  ['slippers', {getIcon: slippers}],
  ['diverHelmet', {getIcon: diverHelmet}],
])

export function itemExists(itemId) {
  return itemMap.has(itemId)
}

export function itemIcon(itemId, className) {
  const item = itemMap.get(itemId)
  if (item) {
    return item.getIcon(className)
  }
  return <div/>
}

export const top = "top"
export const side = "side"
export function itemPosition(itemId) {
  switch (itemId) {
    case 'crown': return top
    default: return side
  }
}

export function getItem(itemId) {
  const item = itemMap.get(itemId)
  if (item) {
    return {name: "MarketPage.Items."+itemId+".Name", specialEffects: item.specialEffects}
  }
  return {name: ""}
}