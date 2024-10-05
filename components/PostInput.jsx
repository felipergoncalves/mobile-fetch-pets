import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { hp } from '../helpers/common';
import { theme } from '../constants/theme';

const PostInput = (props) => {
    return (
      <View style={[styles.container, props.containerStyle && props.containerStyle]}>
        {props.icon && props.icon}
        <TextInput
          style={{ flex: 1 }}
          placeholderTextColor={theme.colors.textLight}
          ref={props.inputRef && props.inputRef}
          multiline={props.multiline} // Permite múltiplas linhas, se necessário
          onChangeText={props.onChangeText} // Callback para capturar o texto digitado
          {...props}
        />
      </View>
    );
};  

export default PostInput

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12
    }
})