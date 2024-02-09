import React from 'react';
import SelectSearch from 'react-select-search';
import { useTranslation } from 'react-i18next';
import { CodeHinter } from '../../../../CodeBuilder/CodeHinter';
import { Color } from '../../../Elements/Color';
import ToggleGroup from '@/ToolJetUI/SwitchGroup/ToggleGroup';
import ToggleGroupItem from '@/ToolJetUI/SwitchGroup/ToggleGroupItem';
import AlignLeft from '@/_ui/Icon/solidIcons/AlignLeft';
import AlignCenter from '@/_ui/Icon/solidIcons/AlignCenter';
import AlignRight from '@/_ui/Icon/solidIcons/AlignRight';

export const StylesTabElements = ({
  column,
  index,
  darkMode,
  currentState,
  onColumnItemChange,
  getPopoverFieldSource,
  setColumnPopoverRootCloseBlocker,
  component,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="field  d-flex custom-gap-12 align-items-center align-self-stretch">
        <label className="d-flex align-items-center" style={{ flex: '1 1 0' }}>
          {t('widget.Table.horizontalAlignment', 'Horizontal Alignment')}
        </label>
        <ToggleGroup
          onValueChange={(_value) => onColumnItemChange(index, 'horizontalAlignment', _value)}
          defaultValue={column?.horizontalAlignment || 'left'}
          style={{ flex: '1 1 0' }}
        >
          <ToggleGroupItem value="left">
            <AlignLeft width={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="center">
            <AlignCenter width={14} />
          </ToggleGroupItem>
          <ToggleGroupItem value="right">
            <AlignRight width={14} />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {/* {['string', 'default', 'number', undefined].includes(column.columnType) && (
        <div className="d-flex flex-column custom-gap-16">
          <div data-cy={`input-overflow`} className="field  d-flex custom-gap-12 align-items-center align-self-stretch">
            <label data-cy={`label-overflow`} className="d-flex align-items-center" style={{ flex: '1 1 0' }}>
              {t('widget.Table.overflow', 'Overflow')}
            </label>
            <ToggleGroup
              onValueChange={(_value) => onColumnItemChange(index, 'textWrap', _value)}
              defaultValue={column.textWrap || 'wrap'}
              style={{ flex: '1 1 0' }}
            >
              <ToggleGroupItem value="wrap">Wrap</ToggleGroupItem>
              <ToggleGroupItem value="scroll">Scroll</ToggleGroupItem>
              <ToggleGroupItem value="hide">Hide</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      )} */}
      {column.columnType === 'toggle' && (
        <div>
          <div className="field">
            <Color
              param={{ name: 'Active color' }}
              paramType="properties"
              componentMeta={{ properties: { color: { displayName: 'Active color' } } }}
              definition={{ value: column.activeColor || '#3c92dc' }}
              onChange={(name, value, color) => onColumnItemChange(index, 'activeColor', color)}
              shouldFlexDirectionBeRow={true}
            />
          </div>
        </div>
      )}
      {column.columnType === 'image' && (
        <>
          <div data-cy={`input-and-label-border-radius`} className="field">
            <label className="form-label">{t('widget.Table.borderRadius', 'Border radius')}</label>
            <CodeHinter
              currentState={currentState}
              initialValue={column.borderRadius}
              theme={darkMode ? 'monokai' : 'default'}
              mode="javascript"
              lineNumbers={false}
              placeholder={''}
              onChange={(value) => onColumnItemChange(index, 'borderRadius', value)}
              componentName={getPopoverFieldSource(column.columnType, 'borderRadius')}
            />
          </div>
          <div data-cy={`input-and-label-width`} className="field ">
            <label className="form-label">{t('widget.Table.width', 'Width')}</label>
            <CodeHinter
              currentState={currentState}
              initialValue={column.width}
              theme={darkMode ? 'monokai' : 'default'}
              mode="javascript"
              lineNumbers={false}
              placeholder={''}
              onChange={(value) => onColumnItemChange(index, 'width', value)}
              componentName={getPopoverFieldSource(column.columnType, 'width')}
            />
          </div>
          <div data-cy={`input-and-label-height`} className="field">
            <label className="form-label">{t('widget.Table.height', 'Height')}</label>
            <CodeHinter
              currentState={currentState}
              initialValue={column.height}
              theme={darkMode ? 'monokai' : 'default'}
              mode="javascript"
              lineNumbers={false}
              placeholder={''}
              onChange={(value) => onColumnItemChange(index, 'height', value)}
              componentName={getPopoverFieldSource(column.columnType, 'height')}
            />
          </div>
          <div data-cy={`input-and-label-object-fit`} className="field">
            <label className="form-label">{t('widget.Table.objectFit', 'Object fit')}</label>
            <SelectSearch
              className={'select-search'}
              options={[
                { name: 'Cover', value: 'cover' },
                { name: 'Contain', value: 'contain' },
                { name: 'Fill', value: 'fill' },
              ]}
              value={column.objectFit}
              search={true}
              closeOnSelect={true}
              onChange={(value) => {
                onColumnItemChange(index, 'objectFit', value);
              }}
              fuzzySearch
              placeholder={t('Select') + '...'}
            />
          </div>
        </>
      )}
      {column.columnType === 'boolean' && (
        <div className="d-flex flex-column custom-gap-16">
          <div className="field">
            <Color
              param={{ name: 'Toggle on bg' }}
              paramType="properties"
              componentMeta={{ properties: { color: { displayName: 'Toggle on bg' } } }}
              definition={{ value: column?.toggleOnBg ? column.toggleOnBg : darkMode ? '#849DFF' : '#3A5CCC' }}
              onChange={(name, value, color) => onColumnItemChange(index, 'toggleOnBg', color)}
              shouldFlexDirectionBeRow={true}
            />
          </div>
          <div className="field">
            <Color
              param={{ name: 'Toggle off bg' }}
              paramType="properties"
              componentMeta={{ properties: { color: { displayName: 'Toggle off bg' } } }}
              definition={{ value: column?.toggleOffBg ? column.toggleOffBg : darkMode ? '#3A3F42' : '#D7DBDF' }}
              onChange={(name, value, color) => onColumnItemChange(index, 'toggleOffBg', color)}
              shouldFlexDirectionBeRow={true}
            />
          </div>
        </div>
      )}

      {['string', 'default', undefined, 'number', 'boolean', 'select'].includes(column.columnType) && (
        <>
          {column.columnType !== 'boolean' && (
            <div data-cy={`input-and-label-text-color`} className="field">
              <Color
                param={{ name: 'Text color' }}
                paramType="properties"
                componentMeta={{ properties: { color: { displayName: 'Text color' } } }}
                definition={{ value: column?.textColor || '#11181C' }}
                onChange={(name, value, color) => onColumnItemChange(index, 'textColor', color)}
                shouldFlexDirectionBeRow={true}
              />
            </div>
          )}
          <div className="field" data-cy={`input-and-label-cell-background-color`}>
            <Color
              param={{ name: 'Cell BG' }}
              paramType="properties"
              componentMeta={{ properties: { color: { displayName: 'Cell Background Color' } } }}
              definition={{ value: column?.cellBackgroundColor }}
              onChange={(name, value, color) => onColumnItemChange(index, 'cellBackgroundColor', color)}
              shouldFlexDirectionBeRow={true}
            />
          </div>
        </>
      )}
    </>
  );
};
