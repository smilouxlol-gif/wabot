package com.tuusuario.miprimermod.init;

import com.tuusuario.miprimermod.MiPrimerMod;
import com.tuusuario.miprimermod.item.LimonItem;
import net.minecraft.world.item.Item;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;
import net.minecraftforge.registries.RegistryObject;

public class ModItems {
    public static final DeferredRegister<Item> ITEMS =
            DeferredRegister.create(ForgeRegistries.ITEMS, MiPrimerMod.MOD_ID);

    public static final RegistryObject<Item> LIMON =
            ITEMS.register("limon", () -> new LimonItem(new Item.Properties()));
}
